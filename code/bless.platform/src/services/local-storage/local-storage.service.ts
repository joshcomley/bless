import { ILocalStorageService } from "./local-storage.contract";

interface StoredValue<T> {
    value: T;
}
export abstract class BlessLocalStorageServiceBase implements ILocalStorageService {
    public clear<T>(key: string): void {
        this.set(key, undefined);
    }

    public get<T>(key: string): T {
        let str = this.getString(key);
        if (str == null) {
            return null;
        }
        try {
            return (JSON.parse(str) as StoredValue<T>)?.value;
        }
        catch {
            // IqlLoggerService.IfEnabled(() => IqlLoggerService.Log("Unable to parse JSON:"));
            // IqlLoggerService.IfEnabled(() => IqlLoggerService.Log(str));
        }
        return null;
    }

    public set<T>(key: string, value: T): void {
        this.setString(key, JSON.stringify({
            value
        } as StoredValue<T>));
    }

    public abstract getString(key: string): string;
    public abstract setString(key: string, value: string): void;
}