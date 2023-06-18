import { InjectionToken } from "@angular/core";
import { ILocalStorageService } from "./local-storage.contract";

export const BLESS_LOCAL_STORAGE_SERVICE = new InjectionToken<ILocalStorageService>("LocalStorageService");
