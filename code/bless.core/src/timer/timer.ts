import { Injectable, Injector } from "@angular/core";
import { EventSubscription, SubscriptionManagerService } from "@bless/core";
import { Subject } from "rxjs";
import { TimerKind } from "./timer-kind";

declare type TimerMode = TimerKind | number | (() => boolean);

export interface TimerEvent {}

export class TimerInfo {
  private readonly subscriptionManager = new SubscriptionManagerService();

  private isRunning: boolean = false;

  private get canRun(): boolean {
    return this.subscriptionManager.subscriptionsCount > 0;
  }

  public count?: number;
  public ref: any;
  public started: boolean = false;

  constructor(
    public readonly mode: TimerMode,
    public readonly key: string,
    public readonly timeout: number,
    public readonly host: TimerService,
    private readonly event: Subject<TimerEvent>
  ) {
    this.subscriptionManager.subscriptionsChanged.subscribe(_ => {
      // Only run the timer when any subscriptions are listening
      if (this.isRunning && !this.canRun) {
        this.stopRun();
      } else if (this.started && this.canRun) {
        this.run();
      }
    });
  }

  public start() {
    this.started = true;
    if (!this.isRunning && this.canRun) {
      this.run();
    }
  }

  public stop() {
    this.started = false;
    this.stopRun();
  }

  public subscribe(action: () => void): EventSubscription {
    return this.subscriptionManager.subscribe(this.event, action);
  }

  private run() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.tick();
  }

  private stopRun() {
    this.isRunning = false;
    if (this.ref) {
      clearTimeout(this.ref);
      this.ref = null;
    }
  }

  private tick() {
    if (!this.isRunning) {
      return;
    }
    this.ref = setTimeout(() => {
      if (this.isRunning && !this.host.disposed) {
        // JC: We could support async await if needed here
        this.event.next({});
        if (
          this.mode === TimerKind.Loop ||
          (typeof this.mode === "function" && !this.mode())
        ) {
          this.tick();
        } else if (typeof this.mode === "number") {
          this.count ??= 0;
          this.count++;
          if (this.count < this.mode) {
            this.tick();
          }
        }
      }
    }, this.timeout);
  }
}

@Injectable({ providedIn: "root" })
export class TimerService {
  private _disposed: boolean;
  private _timers: Map<string, TimerInfo> = new Map<string, TimerInfo>();

  public get disposed(): boolean {
    return this._disposed;
  }

  constructor(injector: Injector) {
  }

  public dispose() {
    this._disposed = true;
    if (this._timers) {
      for (const [key, timer] of this._timers.entries()) {
        clearTimeout(timer.ref);
      }
    }
  }

  public getOrCreateTimer(
    timeout: number,
    key: string,
    mode: TimerMode = TimerKind.Once
  ): TimerInfo {
    this._timers ??= new Map<string, TimerInfo>();
    if (!this.hasTimer(key)) {
      const ev = new Subject<TimerEvent>();
      const timer = new TimerInfo(mode, key, timeout, this, ev);
      this._timers.set(key, timer);
    }
    const timer = this._timers.get(key);
    timer.start();
    return timer;
  }

  public hasTimer(key: string) {
    return this._timers.has(key);
  }
}
