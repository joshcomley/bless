import { IRenderContainer, RendererDefinition } from "../render-template";

export interface RendererLocator {
  locateRenderers(renderContainer: IRenderContainer): RendererDefinition[];
}
