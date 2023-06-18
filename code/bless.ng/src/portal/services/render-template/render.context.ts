import { RenderTemplate } from ".";
import { NextTemplate } from "../../components/portal/next-template";
import { RendererDefinition } from "./renderer-definition";

export class RenderContext<TContext = any, TValue = any, TSender = any> {
  public renderer?: RendererDefinition;
  public sender?: TSender;
  public template?: RenderTemplate;
  public value?: TValue;

  public get context(): TContext {
    return this.getContext ? this.getContext() : null;
  }

  public get next(): NextTemplate | undefined {
    return this.getNext();
  }

  constructor(
    private getNext?: () => NextTemplate,
    private getContext?: () => TContext
  ) {}
}
