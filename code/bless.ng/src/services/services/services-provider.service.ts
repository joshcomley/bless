import { AbstractType, Injectable, InjectionToken, Injector, Type } from "@angular/core";
import { InjectionToken as BlessInjectionToken } from "@bless/core";

@Injectable({ providedIn: "any" })
export class ServicesProvider {
    private _map = new Map<any, any>();

    constructor(public injector: Injector) {
    }

    public get<T>(type: Type<T> | AbstractType<T> | InjectionToken<T> | BlessInjectionToken<T>,
        notFoundValue?: T): T {
        if (!this._map.has(type)) {
            this._map.set(type, this.injector.get(type, notFoundValue));
        }
        return this._map.get(type);
    }

    public inject<T>(name: string, type: Type<T> | AbstractType<T> | InjectionToken<T>): T {
        return this[`_${name}`] ??= this.injector.get(type);
    }
}