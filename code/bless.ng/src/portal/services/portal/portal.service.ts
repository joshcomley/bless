import { ComponentPortal, ComponentType } from "@angular/cdk/portal";
import {
  Injectable,
  Injector,
  StaticProvider,
  ViewContainerRef,
} from "@angular/core";
import { GuidService } from "@bless/core";
import { PortalEnvironment } from "./portal-environment";
import {
  BLESS_PORTAL_CONTEXT,
  BLESS_PORTAL_ENVIRONMENT,
  BLESS_PORTAL_SENDER,
} from "./portal.tokens";

@Injectable()
export class PortalService {
  constructor(private injector: Injector) {}

  public buildComponentPortal<T, TContext = any>(
    component: ComponentType<T>,
    sender: any,
    context: TContext,
    injector?: Injector,
    viewContainerRef?: ViewContainerRef,
    providers?: Array<StaticProvider>
  ): ComponentPortal<T> {
    const environment = new PortalEnvironment(
      injector || this.injector,
      viewContainerRef, // || this.viewContainerRef
      providers
    );
    const portalInjector = this.createPortalInjector(
      sender,
      context,
      environment
    );
    const componentPortal = new ComponentPortal(
      component,
      viewContainerRef, //environment.viewContainerRef,
      portalInjector
    );
    return componentPortal;
  }

  private createPortalInjector(
    sender: any,
    context: any,
    environment: PortalEnvironment
  ): Injector {
    return Injector.create({
      name: GuidService.New(),
      parent: environment.injector,
      providers: [
        { provide: BLESS_PORTAL_SENDER, useValue: sender },
        { provide: BLESS_PORTAL_CONTEXT, useValue: context },
        { provide: BLESS_PORTAL_ENVIRONMENT, useValue: environment },
        ...(environment.providers ?? []),
      ],
    });
  }
}
