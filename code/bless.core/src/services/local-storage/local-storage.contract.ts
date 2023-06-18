export interface ILocalStorageService {
    clear(key: string): void;
    get<T>(key: string): T;
    getString(key: string): string;
    set<T>(key: string, value: T): void;
    setString(key: string, value: string): void;
}