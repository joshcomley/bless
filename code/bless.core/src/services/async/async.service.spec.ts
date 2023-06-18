import { waitForAsync } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { AsyncService } from "./async.service";

describe("AsyncService", () => {
  it(
    "should await promise",
    waitForAsync(async () => {
      const promise = new Promise(resolver => {
        setTimeout(() => {
          resolver(15);
        }, 100);
      });
      const result = await AsyncService.AwaitAsync(promise);
      expect(result).toEqual(15);
    })
  );

  it(
    "should resolve value",
    waitForAsync(async () => {
      const result = await AsyncService.AwaitAsync(16);
      expect(result).toEqual(16);
    })
  );

  it(
    "should resolve observable",
    waitForAsync(async () => {
      const result = await AsyncService.AwaitAsync(of(17));
      expect(result).toEqual(17);
    })
  );

  it(
    "should resolve behavior subject",
    waitForAsync(async () => {
      const subject = new BehaviorSubject<number>(18);
      let result = await AsyncService.AwaitAsync(subject);
      expect(result).toEqual(18);
      subject.next(118);
      result = await AsyncService.AwaitAsync(subject);
      expect(result).toEqual(118);
    })
  );
});
