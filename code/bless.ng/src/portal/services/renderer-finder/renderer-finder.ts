import { Inject, Injectable, Optional } from "@angular/core";
import { ArrayOrSingle, ArrayService } from "@bless/core";
import {
  IRenderContainer,
  RendererDefinition,
  RenderTemplateIdentifier,
  RenderTemplateKind,
} from "../render-template";
import { RendererLocator } from "./renderer-finder.contract";
import { BLESS_PORTAL_RENDERER_LOCATOR } from "./tokens";

@Injectable({ providedIn: "root" })
export class RenderFinder {
  constructor(
    @Optional()
    @Inject(BLESS_PORTAL_RENDERER_LOCATOR)
    private locators?: RendererLocator[]
  ) {}

  public locateRenderers(
    renderContainers: ArrayOrSingle<IRenderContainer>
  ): RendererDefinition[] {
    const all = new Array<RendererDefinition>();
    renderContainers = ArrayService.EnsureArray(renderContainers);
    for (const renderContainer of renderContainers) {
      let processed = false;
      for (let i = 0; i < (this.locators ?? []).length; i++) {
        const found = this.locators[i].locateRenderers(renderContainer);
        if (found !== undefined) {
          processed = true;
          all.push(...(found ?? []));
        }
      }
      if (!processed) {
        all.push(...(renderContainer?.rendering?.renderers ?? []).slice());
        continue;
      }
      const missing = (renderContainer?.rendering?.renderers ?? [])
        .slice()
        .filter(_ => all.find(x => x === _) == null);
      all.push(...missing);
    }
    return ArrayService.OrderByDescending(all, _ => _.priority ?? 0);
  }

  public findRenderer(
    renderContainers: ArrayOrSingle<IRenderContainer>,
    context: any,
    keys: ArrayOrSingle<string>,
    scopes?: ArrayOrSingle<string>,
    entity?: any,
    renderKinds?: RenderTemplateKind[] | RenderTemplateKind,
    sender?: any
  ) {
    const found = this.findRenderers(
      renderContainers,
      context,
      keys,
      scopes,
      entity,
      renderKinds,
      sender
    );
    if (found && found.length > 0) {
      return found[0];
    }
    return null;
  }
  public findRenderers(
    renderContainers: ArrayOrSingle<IRenderContainer>,
    context: any,
    keys: ArrayOrSingle<string>,
    scopes?: ArrayOrSingle<string>,
    entity?: any,
    renderKinds?: RenderTemplateKind[] | RenderTemplateKind,
    sender?: any
  ): RendererDefinition[] {
    return this.filterRenderers(
      this.locateRenderers(renderContainers),
      context,
      keys,
      scopes,
      entity,
      renderKinds,
      sender
    );
  }
  public filterRenderer(
    renderers: RendererDefinition[],
    context: any,
    keys: ArrayOrSingle<string>,
    scopes?: ArrayOrSingle<string>,
    entity?: any,
    renderKinds?: RenderTemplateKind[] | RenderTemplateKind,
    sender?: any
  ): RendererDefinition {
    const result = this.filterRenderers(
      renderers,
      context,
      keys,
      scopes,
      entity,
      renderKinds,
      sender
    );
    if (result?.length > 0) {
      return result[0];
    }
    return null;
  }
  public filterRenderers(
    renderers: RendererDefinition[],
    context: any,
    keys: ArrayOrSingle<string>,
    scopes?: ArrayOrSingle<string>,
    entity?: any,
    renderKinds?: RenderTemplateKind[] | RenderTemplateKind,
    sender?: any
  ): RendererDefinition[] {
    if (!renderers || !renderers.length) {
      return [];
    }
    scopes = ArrayService.EnsureArray(scopes);
    keys = ArrayService.EnsureArray(keys);
    renderKinds = ArrayService.EnsureArray(renderKinds);
    const found = [];
    for (const renderer of renderers) {
      if (
        !RendererDefinition.KeysMatch(renderer.keys, keys) ||
        !RendererDefinition.ScopesMatch(renderer.scope, scopes)
      ) {
        continue;
      }
      if (renderKinds.length > 0) {
        const kind = RenderTemplateIdentifier.ResolveTemplateKind(
          renderer.template
        );
        if (renderKinds.filter(_ => _ === kind).length === 0) {
          continue;
        }
      }
      if (
        renderer.if == null ||
        renderer.if({
          context,
          sender,
          renderer,
          value: entity,
          next: null,
        })
      ) {
        found.push(renderer);
      }
    }
    return found;
  }
}
