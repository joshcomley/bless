import { InjectionToken } from "@angular/core";
import { BlessInjectionToken } from "./services/tokens/token";

export const BLESS_API_BASE_URL = new InjectionToken<BlessInjectionToken<string>>(
    "BlessApiBaseUrl"
);
