import { Type } from "@angular/core";
import { ArrayOrSingle, ArrayService } from "@bless/core";
import { Renderer, RendererDefinition } from "../render-template";
import { WhenRender } from "./when-render";

export class RenderConfiguration {
  private _configures = new Map<Type<any>, ((c: any) => void)[]>();

  constructor(
    private readonly renderKeys: ArrayOrSingle<string>,
    private readonly renderBase: RenderConfigurator<any>
  ) {}

  public apply<TConfiguration>(obj: TConfiguration): this {
    if (obj == null || !this._configures.has(obj.constructor as any)) {
      return this;
    }
    const all = this._configures.get(obj.constructor as any);
    for (const c of all) {
      c(obj);
    }
    return this;
  }

  public configure<TConfiguration>(
    configurationType: Type<TConfiguration>,
    configure: (configuration: TConfiguration) => void
  ): this {
    if (!this._configures.has(configurationType)) {
      this._configures.set(configurationType, []);
    }
    this._configures.get(configurationType).push(configure);
    return this;
  }

  public doNotRender(): this {
    this.renderBase.addDoNotRender(this.renderKeys);
    return this;
  }
}

export class RenderConfigurator<TOwner, TContext = any> {
  private _whenRenderingMap = new Array<WhenRender>();

  public renderers?: RendererDefinition<any>[] = [];

  constructor(public readonly context: TOwner) {}

  public addDoNotRender<T, TContext = any>(
    keys: ArrayOrSingle<string>,
    scope?: string
  ) {
    return this.addRenderer({
      keys,
      scope,
      template: false,
    });
  }

  public addRenderer<T = TContext>(renderer: Renderer<T>): this {
    this.renderers = this.renderers || [];
    this.renderers.push(RendererDefinition.From(renderer));
    return this;
  }

  public configureForRender(
    renderKeys: ArrayOrSingle<string>,
    service: any
  ): this {
    for (const whenRender of this._whenRenderingMap) {
      if (RendererDefinition.KeysMatch(whenRender.when, renderKeys)) {
        whenRender.configuration.apply(service);
      }
    }
    return this;
  }

  public hideWhen(renderKeys: ArrayOrSingle<string>): this {
    this.whenRendering(renderKeys, render => {
      render.doNotRender();
    });
    return this;
  }

  public whenRendering(
    renderKeys: ArrayOrSingle<string>,
    configure: (configuration: RenderConfiguration) => void
  ): this {
    const r = new RenderConfiguration(renderKeys, this);
    configure(r);
    this._whenRenderingMap.push({
      when: ArrayService.EnsureArray(renderKeys),
      configuration: r,
    });
    return this;
  }
}
