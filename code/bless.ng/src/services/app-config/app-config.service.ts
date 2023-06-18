import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { BlessAppConfig } from "./app-config";
import { BLESS_APP_CONFIG, BLESS_APP_CONFIG_URL } from "./tokens";

@Injectable({
  providedIn: "root",
})
export class BlessAppConfigService {
  private _appConfig: BlessAppConfig;
  private _hasLoaded: boolean;
  private _promise: Promise<BlessAppConfig>;

  public get hasLoaded(): boolean {
    return this._hasLoaded;
  }

  constructor(private http: HttpClient, private injector: Injector) { }

  public getConfig<T extends BlessAppConfig>(): T {
    this.tryLoadInjectableAppConfig();
    return this._appConfig as T;
  }

  public loadAppConfig(): Promise<BlessAppConfig> {
    this.tryLoadInjectableAppConfig();
    if (this._appConfig) {
      return Promise.resolve(this._appConfig);
    }
    this._promise = new Promise<BlessAppConfig>(resolver => {
      const url = this.injector.get(BLESS_APP_CONFIG_URL, null);
      if (!url) {
        this._appConfig = {} as BlessAppConfig;
      }
      if (this._appConfig) {
        resolver(this._appConfig);
        return;
      }
      firstValueFrom(this.http.get<BlessAppConfig>(url))
        .then(result => {
          this._appConfig = result;
          this._hasLoaded = true;
          resolver(result);
        });
    });
    return this._promise;
  }

  private tryLoadInjectableAppConfig() {
    if (!this._appConfig) {
      this._appConfig = this.injector.get(BLESS_APP_CONFIG, null);
    }
  }
}
