import { NgModule } from "@angular/core";
import { BLESS_BACK_BUTTON_SERVICE } from "@bless/platform";
import { BackButtonService } from './back-button.service';

@NgModule({
    providers: [
        {
            provide: BLESS_BACK_BUTTON_SERVICE,
            useClass: BackButtonService
        }
    ]
})
export class BlessBackButtonModule { }
