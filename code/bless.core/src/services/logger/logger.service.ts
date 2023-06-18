import { LoggerBase } from "./logger.base";
import { LogKind } from "./logger.kind";
import { ILogger } from "./logger.service.contract";

export class Logger implements ILogger {
    public static Implementation: ILogger = new LoggerBase();

    public enabled: boolean;

    public static Log(message: any, moduleRef?: any, id?: any, kind: LogKind = LogKind.info) {
        Logger.Implementation?.log(message, moduleRef, id, kind);
    }

    public static IfEnabled(fn: (logger: Logger) => void, override: boolean = false) {
        if (Logger.Implementation.enabled || override) {
            const wasEnabled = Logger.Implementation.enabled;
            Logger.Implementation.enabled = override === true;
            fn(Logger.Implementation);
            Logger.Implementation.enabled = wasEnabled;
        }
    }

    public log(message: any, moduleRef?: any, id?: any, kind: LogKind = LogKind.info) {
        Logger.Implementation?.log(message, moduleRef, id, kind);
    }
}