import { ArrayOrSingle } from "@bless/core";
import { LambdaRenderTemplate, RenderTemplate } from "./render-template";

export interface Renderer<TContext = any> {
  context?: any;
  if?: LambdaRenderTemplate<TContext, boolean>;
  priority?: number;
  keys: ArrayOrSingle<string>;
  nickname?: string;
  scope?: string;
  template: RenderTemplate<TContext>;
}
