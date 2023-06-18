export interface ILocalFileReader {
    read(path: string): Promise<any>;
}