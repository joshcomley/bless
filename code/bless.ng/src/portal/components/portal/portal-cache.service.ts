import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";

class CacheService<T> {
  public portalMap = new Map<any, T>();

  public getOrCreate(key: any, factory: () => T) {
    if (!this.portalMap.has(key)) {
      this.portalMap.set(key, factory());
    }
    return this.portalMap.get(key);
  }
}

@Injectable({ providedIn: "root" })
export class TemplateRendererCache extends CacheService<ComponentPortal<any>> {}
