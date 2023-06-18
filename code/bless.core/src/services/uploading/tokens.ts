import { UploaderService } from './uploader.base';
import { InjectionToken } from '../injector/injector';

export const BLESS_UPLOAD_SERVICE = new InjectionToken<UploaderService>("BLESS_UPLOAD_SERVICE");
