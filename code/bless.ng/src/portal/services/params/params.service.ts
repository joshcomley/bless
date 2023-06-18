import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SubscriptionManagerService } from "@bless/core";

@Injectable()
export class ParamsService implements OnDestroy {
    private subscriptionManager = new SubscriptionManagerService();

    constructor(private activatedRoute: ActivatedRoute) {
    }

    public ngOnDestroy(): void {
        this.subscriptionManager.dispose();
    }

    public watchId(onId: (value: any) => void) {
        this.subscriptionManager.subscribe(
            this.activatedRoute.params,
            params => {
                onId(params["id"]);
            }
        );
    }
}