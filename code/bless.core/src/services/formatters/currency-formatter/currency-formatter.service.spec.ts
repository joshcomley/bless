import { TestBed } from "@angular/core/testing";
import { CurrencyFormatterService } from "./currency-formatter.service";

describe("CurrencyFormatterService", () => {
  let service: CurrencyFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyFormatterService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should format as currency with defaults", () => {
    const input = 12.53;
    const expected = "£12.53";
    expect(service.format(input)).toBe(expected);
  });
});
