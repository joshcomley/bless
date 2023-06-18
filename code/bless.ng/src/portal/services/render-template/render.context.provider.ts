import { StaticProvider } from "@angular/core";

export interface IRenderContextProvider {
  renderProvider(): StaticProvider[];
}
