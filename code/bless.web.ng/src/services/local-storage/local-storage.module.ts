import { NgModule } from "@angular/core"
import { BLESS_LOCAL_STORAGE_SERVICE } from "@bless/core";
import { BlessLocalStorageService } from "@bless/web";

@NgModule({
    providers: [
        {
            provide: BLESS_LOCAL_STORAGE_SERVICE,
            useClass: BlessLocalStorageService
        }
    ]
})
export class BlessWebLocalStorageModule { }
