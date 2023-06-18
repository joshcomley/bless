import { BlessLocalStorageServiceBase } from "@bless/platform";
			
import * as appSettings from "@nativescript/core/application-settings";

export class BlessLocalStorageService extends BlessLocalStorageServiceBase {
	public getString(key: string): string {
        return appSettings.getString(key);
    }

	public setString(key: string, value: string): void {
        appSettings.setString(key, value);
    }
}