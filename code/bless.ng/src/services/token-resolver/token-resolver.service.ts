import { Injectable } from "@angular/core";
import { BlessValueResolver } from "@bless/core";
import { BlessAppConfigService } from "../app-config";
import { BlessAppConfigToken, BlessInjectionToken } from "../tokens";

@Injectable({
  providedIn: "root",
})
export class BlessTokenResolverService {
  constructor(private appConfig: BlessAppConfigService) {}

  public resolveValue<T>(value: BlessInjectionToken<T>): T {
    if (value instanceof BlessValueResolver) {
      return value.getValue();
    }
    if (value instanceof BlessAppConfigToken) {
      const appConfig = this.appConfig.getConfig();
      return appConfig == null ? null : appConfig[value.name];
    }
    return value;
  }

  public async resolveValueAsync<T>(value: BlessInjectionToken<T>): Promise<T> {
    if (!this.appConfig.hasLoaded) {
      await this.appConfig.loadAppConfig();
    }
    return this.resolveValue(value);
  }
}
