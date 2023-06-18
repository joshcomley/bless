import { Subscription } from "rxjs";

export class EventSubscription {
  private _key: string;
  private _onUnsubscribe: (sender: EventSubscription) => void;
  private _subjectSubscription: Subscription[];
  private _unbsubscribed = false;

  public paused: boolean = false;

  public get key(): string {
    return this._key;
  }

  public get unsubscribed(): boolean {
    return this._unbsubscribed;
  }

  constructor(
    key: string,
    subjectSubscription: Subscription[],
    onUnsubscribe: (sender: EventSubscription) => void
  ) {
    this._key = key;
    this._subjectSubscription = subjectSubscription;
    this._onUnsubscribe = onUnsubscribe;
  }

  public pause(): void {
    this.paused = true;
  }

  public setSubscriptions(subscription: Subscription[]) {
    this._subjectSubscription = subscription;
  }

  public unpause(): void {
    this.paused = false;
  }

  public unsubscribe(): void {
    if (!this._unbsubscribed) {
      this._unbsubscribed = true;
      if (
        this._subjectSubscription &&
        Array.isArray(this._subjectSubscription)
      ) {
        for (const sub of this._subjectSubscription) {
          sub.unsubscribe();
        }
      }
      if (this._onUnsubscribe) {
        this._onUnsubscribe(this);
      }
    }
  }
}
