import { LogKind } from "./logger.kind";

export interface ILogger {
    enabled: boolean;

    log(message: any, moduleRef?: any, id?: any, kind?: LogKind);
}