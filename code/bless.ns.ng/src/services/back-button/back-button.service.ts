import { Injectable } from "@angular/core";
import { BackButtonService as BackButtonServiceNs } from "@bless/ns";
import { RouterExtensions } from "@nativescript/angular";

@Injectable({ providedIn: "platform" })
export class BackButtonService extends BackButtonServiceNs {
    constructor(private router: RouterExtensions) {
        super();
    }
    protected override goBack(): void {
        super.goBack();
        this.router.back();
    }
}