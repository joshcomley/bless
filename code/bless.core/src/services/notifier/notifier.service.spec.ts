import { TestBed, waitForAsync } from "@angular/core/testing";
import { NzMessageModule } from "ng-zorro-antd/message";
import { NotifierService } from "./notifier.service";

describe("NotifierService", () => {
  let service: NotifierService;

  beforeEach(
    waitForAsync(async () => {
      TestBed.configureTestingModule({
        declarations: [],
        imports: [NzMessageModule],
        providers: [NotifierService],
      });
      service = TestBed.inject(NotifierService);
    })
  );

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
