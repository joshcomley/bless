import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { GuidService } from "../guid/guid.service";

export class BusyChangedEvent {
  constructor(public key: string, public busy: boolean) { }
}
export declare type KeyOrChecker = string | ((key: string, qualifiedKey?: string) => boolean);
@Injectable({
  providedIn: "root",
})
export class BusyService {
  private _anyLoading = false;
  private _busyMap = new Map<string, string>();
  private _id: string;
  private _parent: BusyService;
  private _type: string;

  public readonly anyBusyChanged = new Subject<boolean>();
  public readonly busyChanged = new Subject<BusyChangedEvent>();

  public get anyBusy(): boolean {
    return this._anyLoading;
  }

  public get id(): string {
    return this._id;
  }

  constructor() {
    this._id = GuidService.New();
  }

  public configureWith(container: any, parent: BusyService): this {
    this._type = container.constructor.name;
    this._parent = parent;
    return this;
  }

  public dispose(): void {
    this.unmarkAll();
  }

  public getKey(key: string): string {
    return `${this._type} (${this._id}): ${key}`;
  }

  public isBusy(
    ...keyOrCheckers: Array<KeyOrChecker>
  ) {
    if (keyOrCheckers?.length > 0) {
      for (let i = 0; i < keyOrCheckers.length; i++) {
        if (this.isBusyInetrnal(keyOrCheckers[i])) {
          return true;
        }
      }
      return false;
    }
    return this.isBusyInetrnal("");
  }

  private isBusyInetrnal(
    keyOrChecker: KeyOrChecker
  ) {
    keyOrChecker ??= "";
    if (typeof keyOrChecker === "string") {
      if (!this._busyMap.has(keyOrChecker)) {
        return false;
      }
      return this._busyMap.get(keyOrChecker) != null;
    } else {
      for (const [key, value] of this._busyMap.entries()) {
        if (keyOrChecker(value, key)) {
          return true;
        }
      }
    }
    return false;
  }

  public toggleBusy(key: string = "", busy: boolean = undefined): boolean {
    if (busy !== undefined) {
      if (busy) {
        return this.markBusy(key);
      } else {
        return this.unmarkBusy(key);
      }
    }
    if (this.isBusy(key)) {
      return this.unmarkBusy(key);
    }
    return this.markBusy(key);
  }

  public markBusy(...keys: string[]): boolean {
    if (keys?.length > 0) {
      const arr = new Array<boolean>();
      for (let i = 0; i < keys.length; i++) {
        this.markBusyInternal(keys[i], keys[i]);
      }
      return arr.find(_ => _ === false) == null;
    }
    return this.markBusyInternal("", "");
  }

  public markBusyWhile(key: string, fn: (unmark: () => void) => void) {
    this.markBusy(key);
    fn(() => this.unmarkBusy(key));
    this.unmarkBusy(key);
  }

  public markBusyWhileAsync(
    key: string,
    fn: (unmark: () => void) => Promise<any>
  ) {
    this.markBusy(key);
    // this.notifyChange(`${key} marked as busy`);
    fn(() => this.unmarkBusy(key)).then(
      _ => {
        this.unmarkBusy(key);
      },
      error => {
        this.unmarkBusy(key);
      }
    );
  }

  public printDebug() {
    this._busyMap.forEach((v: string, key: string) => {
      console.log(`${key}: busy - ${v}`);
    });
  }

  public setBusy(key: string, busy: boolean): boolean {
    if (busy) {
      return this.markBusy(key);
    }
    return this.unmarkBusy(key);
  }

  public unmarkAll() {
    this._busyMap.forEach((v: string, key: string) => {
      this.unmarkBusy(key);
    });
  }

  public unmarkBusy(...keys: string[]): boolean {
    if (keys?.length > 0) {
      const arr = new Array<boolean>();
      for (let i = 0; i < keys.length; i++) {
        this.unmarkBusyInternal(keys[i]);
      }
      return arr.find(_ => _ === false) == null;
    }
    return this.unmarkBusyInternal("");
  }

  private unmarkBusyInternal(key: string): boolean {
    // console.log('MARK BUSY: OFF: ' + key);
    if (this._parent) {
      this._parent.unmarkBusy(this.getKey(key));
    }
    if (this._busyMap.has(key)) {
      this._busyMap.delete(key);
      this.updateIsBusy();
      this.busyChanged.next(new BusyChangedEvent(key, false));
      // this.notifyChange(`${key} unmarked as busy`);
      return true;
    }
    return false;
  }

  private markBusyInternal(key: string, value: string): boolean {
    key ??= "";
    // console.log('MARK BUSY: ON: ' + key);
    if (this._parent) {
      this._parent.markBusyInternal(this.getKey(key), value);
    }
    if (!this._busyMap.has(key)) {
      this._busyMap.set(key, value);
      this.updateIsBusy();
      this.busyChanged.next(new BusyChangedEvent(key, true));
      return true;
      // if (notify) {
      //     this.notifyChange(`${key} marked as busy`);
      // }
    }
    return false;
  }

  private updateIsBusy() {
    if (this._parent) {
      this._parent.updateIsBusy();
    }
    const oldValue = this.anyBusy;
    let newValue = false;
    if (this._busyMap.size > 0) {
      newValue = true;
    }
    this._anyLoading = newValue;
    if (newValue !== oldValue) {
      this.anyBusyChanged.next(newValue);
    }
  }
}
