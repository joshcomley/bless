import { RenderConfigurator } from "../render-configurator";

export interface IRenderContainer<TOwner = any, TContext = any> {
  rendering: RenderConfigurator<TOwner, TContext>;
}
