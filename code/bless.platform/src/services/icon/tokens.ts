import { InjectionToken } from "@angular/core";
import { IconRegistryService } from './icon-registry.service';

export const BLESS_ICON_REGISTRY_TOKEN_RESOLVER = new InjectionToken<IconRegistryService>(
    "BLESS_ICON_REGISTRY_TOKEN_RESOLVER"
);