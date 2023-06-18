import { InjectionToken } from "@angular/core";
import { BlessBearerTokenResolver } from "./api-bearer-token.resolver";

export const BLESS_API_BEARER_TOKEN_RESOLVER = new InjectionToken<BlessBearerTokenResolver>(
    "BlessApiBearerTokenResolver"
);