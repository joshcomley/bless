import { Injectable } from "@angular/core";
import { RenderConfigurator } from "../render-configurator";
import { IRenderContainer } from "../render-template";

@Injectable({ providedIn: "root" })
export class RenderRegistration implements IRenderContainer {
  public rendering: RenderConfigurator<RenderRegistration> =
    new RenderConfigurator(this);
}
