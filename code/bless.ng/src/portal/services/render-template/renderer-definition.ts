import { ArrayOrSingle, ArrayService, StringService } from "@bless/core";
import { LambdaRenderTemplate, RenderTemplate } from "./render-template";
import { Renderer } from "./render.contract";

export class RendererDefinition<T = any, TContext = any> {
  public context: TContext;
  public if: LambdaRenderTemplate<T, TContext, boolean>;
  public keys: ArrayOrSingle<string>;
  public nickname: string;
  public scope: string;
  public priority: number;
  public template: RenderTemplate<T>;

  constructor(template?: RenderTemplate<T>) {
    this.template = template;
  }

  public static From(renderer: Renderer) {
    const definition = new RendererDefinition();
    definition.context = renderer.context;
    definition.template = renderer.template;
    definition.if = renderer.if;
    definition.priority = renderer.priority ?? 0;
    definition.keys = renderer.keys;
    definition.scope = renderer.scope;
    definition.nickname = renderer.nickname;
    return definition;
  }

  public static KeysMatch(
    rendererKeys: ArrayOrSingle<string>,
    renderKeys: ArrayOrSingle<string>
  ): boolean {
    rendererKeys = ArrayService.EnsureArray(rendererKeys).map(_ =>
      (_ ?? "").trim()
    );
    renderKeys = ArrayService.EnsureArray(renderKeys).map(_ =>
      (_ ?? "").trim()
    );
    for (const left of rendererKeys) {
      if (renderKeys.find(_ => _ === left) == null) {
        return false;
      }
    }
    return true;
  }

  public static ScopesMatch(
    left: string,
    rightArray: ArrayOrSingle<string>
  ): boolean {
    if (StringService.IsNullOrWhiteSpace(left)) {
      return true;
    }
    return this.KeysMatch(left, rightArray);
  }
}
