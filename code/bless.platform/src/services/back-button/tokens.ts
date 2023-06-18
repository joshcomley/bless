import { InjectionToken } from "@angular/core";
import { BackButtonServiceBase } from './back-button.service';

export const BLESS_BACK_BUTTON_SERVICE = new InjectionToken<BackButtonServiceBase>(
    "BlessBackButtonService"
);