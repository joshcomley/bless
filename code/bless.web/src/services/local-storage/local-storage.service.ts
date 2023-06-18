import { Injectable } from "@angular/core";
import { BlessLocalStorageServiceBase } from "@bless/platform";
			
class BlessLocalStorageStub {
	private ms = {};

	public clear() {
        this.ms = {};
        return true;
    }

	public getItem(key) {
        return key in this.ms ? this.ms[key] : null;
    }

	public removeItem(key) {
        var found = key in this.ms;
        if (found) {
            return delete this.ms[key];
        }
        return false;
    }

	public setItem(key, value) {
        this.ms[key] = value;
        return true;
    }
}
class BlessLocalStorageInner {
	private static InstanceInner: BlessLocalStorageInner;

	public static get Instance(): BlessLocalStorageInner {
        return this.InstanceInner = this.InstanceInner || new BlessLocalStorageInner();
    }

	private _global = undefined;
	private _globalSet = false;
	private _ls = undefined;
	private _lsSet = false;
	private listeners = {};
	private listening = false;

	private get globalContext(): any {
        if (!this._globalSet) {
            this._globalSet = true;
            this._global = eval("typeof global !== 'undefined'") ? eval("global") : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        }
        return this._global;
    }

	private get ls(): any {
        if (!this._lsSet) {
            this._lsSet = true;
            let g = this.globalContext;
            this._ls = "localStorage" in g && g.localStorage ? g.localStorage : new BlessLocalStorageStub();
        }
        return this._ls;
    }

	public accessor(key, value) {
        if (arguments.length === 1) {
            return this.get(key);
        }
        return this.set(key, value);
    }

	public backend(store) {
        store && (this._ls = store);
        this._lsSet = true;
        return this.ls;
    }

	public change(e) {
        if (!e) {
            e = this.globalContext.event;
        }
        var all = this.listeners[e.key];
        if (all) {
            all.forEach(fire);
        }

        function fire(listener) {
            listener(this.parse(e.newValue), this.parse(e.oldValue), e.url || e.uri);
        }
    }

	public clear() {
        return this.ls.clear();
    }

	public get(key) {
        const raw = this.ls.getItem(key);
        const parsed = this.parse(raw);
        return parsed;
    }

	public listen() {
        if (this.globalContext.addEventListener) {
            this.globalContext.addEventListener("storage", this.change, false);
        } else if (this.globalContext.attachEvent) {
            this.globalContext.attachEvent("onstorage", this.change);
        } else {
            this.globalContext.onstorage = this.change;
        }
    }

	public off(key, fn) {
        var ns = this.listeners[key];
        if (ns.length > 1) {
            ns.splice(ns.indexOf(fn), 1);
        } else {
            this.listeners[key] = [];
        }
    }

	public on(key, fn) {
        if (this.listeners[key]) {
            this.listeners[key].push(fn);
        } else {
            this.listeners[key] = [fn];
        }
        if (this.listening === false) {
            this.listen();
        }
    }

	public parse(rawValue) {
        const parsed = this.parseValue(rawValue);

        if (parsed === undefined) {
            return null;
        }

        return parsed;
    }

	public parseValue(rawValue) {
        try {
            return JSON.parse(rawValue);
        } catch (err) {
            return rawValue;
        }
    }

	public remove(key) {
        return this.ls.removeItem(key);
    }

	public set(key, value) {
        try {
            this.ls.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    }
}
@Injectable({ providedIn: "root" })
export class BlessLocalStorageService extends BlessLocalStorageServiceBase {
	public getString(key: string): string {
        return BlessLocalStorageInner.Instance.get(key);
    }

	public removeString(key: string): void {
        BlessLocalStorageInner.Instance.remove(key);
    }

	public setString(key: string, value: string): void {
        BlessLocalStorageInner.Instance.set(key, value);
    }
}