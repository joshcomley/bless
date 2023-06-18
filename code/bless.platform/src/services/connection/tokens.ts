import { InjectionToken } from "@bless/core";
import { ConnectionMonitorService } from "./connection-monitor.base.service";

export const BLESS_CONNECTION_MONITOR_TOKEN = new InjectionToken<ConnectionMonitorService>(
    "BLESS_CONNECTION_MONITOR_TOKEN"
);