import { Observable, Subject, Subscription } from "rxjs";
import { ArrayOrSingle } from "..";
import { EventSubscription } from "./event-subscription.model";

export enum SubscriptionsChangedEventKind {
  added,
  removed,
}

export interface SubscriptionsChangedEvent {
  host: SubscriptionManagerService;
  key: string;
  kind: SubscriptionsChangedEventKind;
  subscription: EventSubscription;
}

/*
   Manage subscriptions to, for example, subjects.
   Subscriptions can be grouped by key, and when no longer needed
   this class can be disposed, closing all subscriptions created
   with it
*/
export class SubscriptionManagerService {
  private _subscriptions = new Map<string, Array<EventSubscription>>();
  private _subscriptionsCount = 0;

  public readonly subscriptionsChanged =
    new Subject<SubscriptionsChangedEvent>();

  public get subscriptionsCount(): number {
    return this._subscriptionsCount;
  }

  constructor() {}

  public dispose(): void {
    this.unsubscribeAll();
  }

  public pause(key?: string) {
    this.forSubscriptions(key, _ => {
      for (const sub of _) {
        sub.pause();
      }
    });
  }

  public pauseWhile(action: () => void, key?: string) {
    this.pause(key);
    action();
    this.unpause(key);
  }

  public subscribe<T>(
    subjects: ArrayOrSingle<Observable<T>>,
    next: (value: T, subject?: Observable<T>) => void,
    key: string = "",
    count?: number
  ): EventSubscription {
    key = key || "";
    if (!this._subscriptions.has(key)) {
      this._subscriptions.set(key, []);
    }
    const eventSubscription = new EventSubscription(key, null, _ => {
      const arr = this._subscriptions.get(key);
      const sub = arr.indexOf(_);
      arr.splice(sub, 1);
      this.subscriptionsUpdated(
        key,
        SubscriptionsChangedEventKind.removed,
        eventSubscription
      );
    });
    this._subscriptions.get(key).push(eventSubscription);
    this.subscriptionsUpdated(
      key,
      SubscriptionsChangedEventKind.added,
      eventSubscription
    );
    const subscriptions = new Array<Subscription>();
    if (!Array.isArray(subjects)) {
      subjects = [subjects];
    }
    let callCount = 0;
    for (const subject of subjects) {
      subscriptions.push(
        subject.subscribe(_ => {
          callCount++;
          if (!eventSubscription.paused && !eventSubscription.unsubscribed) {
            next(_, subject);
          }
          if (count != null && count >= callCount) {
            eventSubscription.unsubscribe();
          }
        })
      );
    }
    eventSubscription.setSubscriptions(subscriptions);
    return eventSubscription;
  }

  public subscribeAndReplace<T>(
    subjects: Observable<T> | Array<Observable<T>>,
    next: (value: T, subject?: Observable<T>) => void,
    key: string,
    count?: number
  ): EventSubscription {
    this.unsubscribeAll(key);
    return subjects == null ||
      (Array.isArray(subjects) && subjects.length === 0)
      ? null
      : this.subscribe(subjects, next, key, count);
  }

  public subscribeOnce<T>(
    subjects: Observable<T> | Array<Observable<T>>,
    next: (value: T, subject?: Observable<T>) => void,
    key: string = ""
  ): EventSubscription {
    return this.subscribe(subjects, next, key, 1);
  }

  public unpause(key?: string) {
    this.forSubscriptions(key, _ => {
      for (const sub of _) {
        sub.unpause();
      }
    });
  }

  public unsubscribeAll(key?: string): void {
    this.forSubscriptions(key, _ => this.unsubscribeArray(_));
  }

  private forSubscriptions(
    key: string,
    action: (subs: EventSubscription[]) => void
  ): void {
    if (key) {
      const arr = this._subscriptions.get(key);
      if (arr) {
        action(arr.slice(0));
      }
    } else {
      this._subscriptions.forEach((arr, value, map) => {
        action(arr.slice(0));
      });
    }
  }

  private subscriptionsUpdated(
    key: string,
    kind: SubscriptionsChangedEventKind,
    eventSubscription: EventSubscription
  ) {
    this.updateCount();
    this.subscriptionsChanged.next({
      key,
      kind: kind,
      subscription: eventSubscription,
      host: this,
    });
  }

  private unsubscribeArray(arr: Array<EventSubscription>): void {
    for (const item of arr) {
      item.unsubscribe();
    }
  }

  private updateCount() {
    let count = 0;
    for (const [key, value] of this._subscriptions.entries()) {
      count += value?.length ?? 0;
    }
    this._subscriptionsCount = count;
  }
}
