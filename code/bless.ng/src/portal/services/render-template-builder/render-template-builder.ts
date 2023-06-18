import { ComponentPortal, ComponentType } from "@angular/cdk/portal";
import { Injector, StaticProvider, ViewContainerRef } from "@angular/core";
import { ArrayService } from "@bless/core";
import { Subject } from "rxjs";
import { IRenderContextProvider } from "..";
import { PortalService } from "../portal";
import { RendererDefinition } from "../render-template";
import { RenderContext } from "../render-template/render.context";

export class RenderTemplateBuilder {
  private _componentPortal: ComponentPortal<any>;

  public onBuilt = new Subject<any>();

  public get portal(): ComponentPortal<any> {
    return this._componentPortal;
  }

  constructor(private portalService: PortalService) {}

  public buildPortal(
    renderer: RendererDefinition,
    renderContext: RenderContext,
    injector?: Injector,
    viewContainerRef?: ViewContainerRef,
    providers?: Array<StaticProvider>
  ): ComponentPortal<any> {
    if (!this._componentPortal) {
      const provider = renderContext.context as IRenderContextProvider;
      const allProviders = ArrayService.EnsureArray(providers);
      if (provider?.renderProvider) {
        allProviders.push(
          ...ArrayService.EnsureArray(provider.renderProvider())
        );
      }
      this._componentPortal = this.portalService.buildComponentPortal(
        renderer.template as ComponentType<any>,
        this,
        renderContext,
        injector,
        viewContainerRef,
        allProviders
      );
    }
    return this._componentPortal;
  }
}
