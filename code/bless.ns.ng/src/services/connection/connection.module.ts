import { NgModule } from "@angular/core";
import { ConnectionMonitor } from "@bless/ns";
import { BLESS_CONNECTION_MONITOR_TOKEN } from "@bless/platform";

@NgModule({
    providers: [
        {
            provide: BLESS_CONNECTION_MONITOR_TOKEN,
            useClass: ConnectionMonitor
        }
    ]
})
export class BlessConnectionModule { }
