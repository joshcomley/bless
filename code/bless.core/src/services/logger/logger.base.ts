import { ILogger } from "@bless/core";
import { LogKind } from "./logger.kind";

export class LoggerBase implements ILogger {
    public enabled: boolean;
    
    public error(message: any, module: any = null, id: any = null) {
        this.log(message, id, LogKind.error);
    }

    public log(message: any, moduleRef: any = null, id: any = null, kind: LogKind = LogKind.info, force: boolean = false) {
        if (this.enabled || force) {
            return this.logInternal(message, moduleRef, id, kind);
        }
        return null;
    }

    protected logInternal(message: any, moduleRef: any = null, id: any, kind: LogKind) {
        this.simpleLog(message, moduleRef, id, kind);
    }

    protected simpleLog(message: any, moduleRef: any = null, id: any, kind: LogKind) {
        kind = kind || LogKind.info;
        let msg = `${message} (${id})`;
        switch (kind) {
            case LogKind.info:
                console.log(msg);
                break;
            case LogKind.error:
                console.error(msg);
                break;
        }
    }
}