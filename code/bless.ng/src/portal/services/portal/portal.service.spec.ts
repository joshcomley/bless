import { ViewContainerRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { PortalService } from "./portal.service";

describe("PortalService", () => {
  let service: PortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortalService, { provide: ViewContainerRef, useValue: {} }],
    });
    service = TestBed.inject(PortalService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
