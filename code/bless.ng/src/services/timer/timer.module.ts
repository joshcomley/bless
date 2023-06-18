import { NgModule } from "@angular/core";
import { TimerService } from "@bless/core";

@NgModule({
    providers: [
        {
            provide: TimerService,
            useClass: TimerService
        }
    ],
})
export class TimerModule { }
