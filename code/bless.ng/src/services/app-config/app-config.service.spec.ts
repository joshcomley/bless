import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { BlessAppConfigService } from "./app-config.service";

describe("AppConfigService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
  );

  it("should be created", () => {
    const service: BlessAppConfigService = TestBed.inject(BlessAppConfigService);
    expect(service).toBeTruthy();
  });
});
