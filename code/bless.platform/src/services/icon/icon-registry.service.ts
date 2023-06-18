import { Type } from "@bless/core";
import { IconRegistration, IconRegistrationParams } from "./icon-registration";

export class IconRegistryService {
  private _iconRegistrations: IconRegistration[] = [];
  private _registry = new Map<string, IconRegistration>();

  public registerRenderers = new Map<string, any>();

  public get registrations(): IconRegistration[] {
    return this._iconRegistrations.slice(0);
  }

  public getIcon(key: string): IconRegistration {
    return this._registry.get(key);
  }

  public registerIcon(params: IconRegistrationParams): this {
    if (
      params.overwriteExistingRegistration !== true &&
      this._registry.has(params.key)
    ) {
      return this;
    }
    this._registry.set(
      params.key,
      new IconRegistration(
        params.key,
        params.group,
        params.icon,
        () =>
          typeof params.renderer === "string"
            ? this.registerRenderers.get(params.renderer)
            : params.renderer,
        params.theme
      )
    );
    this.updateIcons();
    return this;
  }

  public registerRenderer<T>(key: string, renderer: Type<T>): void {
    this.registerRenderers.set(key, renderer);
  }

  private updateIcons(): void {
    const result = [];
    const all = this._registry.keys();
    for (const entry of all) {
      result.push(this._registry.get(entry));
    }
    this._iconRegistrations = result;
  }
}
