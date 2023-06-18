import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { BlessTokenResolverService } from "./token-resolver.service";

describe("ValueResolverService", () => {
  let service: BlessTokenResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(BlessTokenResolverService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
