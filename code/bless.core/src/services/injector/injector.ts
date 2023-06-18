import { Type } from "../../types";

export class InjectionToken<T = any> {
    constructor(public key: string) {
    }
}

export const BLESS_INJECTOR_SERVICE = new InjectionToken<IInjector>("BLESS_INJECTOR_SERVICE");

export interface IInjector {
    inject<T>(_: Type<T> | InjectionToken<T>, defaultValue?: T): T;
}