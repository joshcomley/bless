import { Injector, StaticProvider, ViewContainerRef } from "@angular/core";

export class PortalEnvironment {
  constructor(
    public injector: Injector,
    public viewContainerRef: ViewContainerRef,
    public providers: Array<StaticProvider>
  ) {}
}
