import { Injectable, Injector } from "@angular/core";
import { IInjector, InjectionToken, Type } from "@bless/core";

@Injectable({ providedIn: "root" })
export class BlessNgInjector implements IInjector {
    constructor(private injector: Injector) {
    }

    inject<T>(_: Type<T> | InjectionToken<T>, defaultValue?: T): T {
        return this.injector.get(_, defaultValue);
    }
}