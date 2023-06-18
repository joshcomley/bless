import { RenderConfiguration } from "./render-configurator.service";

export interface WhenRender {
  configuration: RenderConfiguration;
  when: string[];
}
