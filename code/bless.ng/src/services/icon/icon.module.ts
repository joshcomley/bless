import { NgModule } from "@angular/core";
import { IconRegistryService } from "@bless/platform";

@NgModule({
    providers: [
        {
            provide: IconRegistryService,
            useClass: IconRegistryService
        }
    ],
})
export class IconModule { }
