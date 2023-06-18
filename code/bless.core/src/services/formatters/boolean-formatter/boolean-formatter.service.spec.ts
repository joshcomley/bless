import { TestBed } from "@angular/core/testing";

import { BooleanFormatterService } from "./boolean-formatter.service";

describe("BooleanFormatterService", () => {
  let service: BooleanFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BooleanFormatterService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
