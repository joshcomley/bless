import { InjectionToken } from "@angular/core";
import { RendererLocator } from "./renderer-finder.contract";

export const BLESS_PORTAL_RENDERER_LOCATOR = new InjectionToken<
  RendererLocator[]
>("BlessRendererLocator");
