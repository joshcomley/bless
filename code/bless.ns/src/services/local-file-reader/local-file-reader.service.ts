import { ILocalFileReader } from "@bless/platform";

export class BlessLocalFileReaderService implements ILocalFileReader {
    read(path: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}