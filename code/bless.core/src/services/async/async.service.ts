import { BehaviorSubject, firstValueFrom, from, Observable } from "rxjs";
import { AsyncType } from "./async.type";

export class AsyncService {
  public static ToPromise<T>(value: AsyncType<T>): Promise<T> {
    if (value == null) {
      return Promise.resolve(value as T);
    }
    if (value instanceof BehaviorSubject) {
      return Promise.resolve(value.value);
    }
    if (value instanceof Observable) {
      return firstValueFrom(value);
    }
    if (value instanceof Promise) {
      return value;
    }
    return Promise.resolve(value);
  }

  public static ToObservable<T>(value: AsyncType<T>): Observable<T> {
    return from(this.ToPromise(value));
  }
  
  public static async AwaitAsync<T>(value: AsyncType<T>) {
    return await this.ToPromise(value);
  }
}
