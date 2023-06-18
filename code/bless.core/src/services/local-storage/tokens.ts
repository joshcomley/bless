import { ILocalStorageService } from "./local-storage.contract";
import { InjectionToken } from '../injector/injector';

export const BLESS_LOCAL_STORAGE_SERVICE = new InjectionToken<ILocalStorageService>("LocalStorageService");
