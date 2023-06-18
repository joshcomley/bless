import { TestBed } from "@angular/core/testing";

import { OptionsService } from "./options.service";

describe("OptionsService", () => {
  let service: OptionsService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new OptionsService();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
