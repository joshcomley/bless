import { RenderContext, RendererDefinition } from "../../services";

export class NextTemplate {
  private _context: RenderContext;

  public next?: NextTemplate;

  public get context(): RenderContext {
    return (this._context ??= this.getContext());
  }

  constructor(
    public definition: RendererDefinition,
    public getContext: () => RenderContext
  ) {}
}
