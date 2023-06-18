import { TestBed } from "@angular/core/testing";
import { Subject } from "rxjs";
import { SubscriptionManagerService } from "./subscription-manager.service";

describe("SubscriptionManagerService", () => {
  let service: SubscriptionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new SubscriptionManagerService();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should subscribe and unsubscribe correctly", () => {
    let i = 0;
    const subject = new Subject<string>();
    service.subscribe(subject, _ => i++);
    const sub2 = service.subscribe(subject, _ => i++);
    service.subscribe(subject, _ => i++, "test1");
    service.subscribe(subject, _ => i++, "test2");
    service.subscribe(subject, _ => i++, "test3");
    service.subscribe(subject, _ => i++, "test4");
    service.subscribe(subject, _ => i++, "test4");
    subject.next("a");
    expect(i).toEqual(7);
    subject.next("b");
    expect(i).toEqual(14);
    sub2.unsubscribe();
    subject.next("c");
    expect(i).toEqual(20);
    subject.next("d");
    expect(i).toEqual(26);
    service.unsubscribeAll("test4");
    subject.next("e");
    expect(i).toEqual(30);
    service.dispose();
    subject.next("f");
    expect(i).toEqual(30);
  });
});
