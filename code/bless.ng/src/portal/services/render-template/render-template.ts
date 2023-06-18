import { ComponentType } from "@angular/cdk/portal";
import { TemplateRef } from "@angular/core";
import { RenderContext } from "./render.context";

export const DoNotRender: DoNotRenderTemplate = false;
export type DoNotRenderTemplate = false;

export type LambdaRenderTemplate<
  TContext = any,
  TValue = any,
  TSender = any
> = (
  context: RenderContext<TContext, TValue, TSender>
) => TValue | RenderTemplate<TContext>;

// export type PropertyRenderTemplate<T = any> = PropertyPath<T>;

export type StringRenderTemplate = string | number | Date | null;

export type TextRenderTemplate<T = any> =
  | StringRenderTemplate
  | LambdaRenderTemplate<T>
  // | PropertyRenderTemplate<T>
  ;

export type TemplateRefRenderTemplate = TemplateRef<any>;

export type ComponentRenderTemplate = ComponentType<any>;

export type RenderTemplate<T = any> =
  | ComponentRenderTemplate
  | StringRenderTemplate
  | LambdaRenderTemplate<T>
  // | PropertyRenderTemplate<T>
  | DoNotRenderTemplate
  | TemplateRefRenderTemplate;

export enum RenderTemplateKind {
  // property = 1,
  text = 2,
  lambda = 4,
  component = 8,
  noRender = 16,
}
