import { InjectionToken } from "@angular/core";
import { BlessAppConfig } from "./app-config";

export const BLESS_APP_CONFIG_URL = new InjectionToken<string>(
    "BlessAppConfigUrl"
);

export const BLESS_APP_CONFIG = new InjectionToken<BlessAppConfig>(
    "BlessAppConfig"
);
