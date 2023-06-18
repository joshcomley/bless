import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Injector, NgZone, ViewContainerRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BusyService, SubscriptionManagerService, TimerService, ValueFormatters } from "@bless/core";
import { NotifierService, ParamsService } from "@bless/ng";
import { BackButtonServiceBase, BLESS_BACK_BUTTON_SERVICE, BLESS_LOCAL_STORAGE_SERVICE, IconRegistryService, ILocalStorageService } from "@bless/platform";
import { ServicesProvider } from "./services-provider.service";

export class Services extends ServicesProvider {
    private _busy: BusyService;

    protected _subscriptionManager: SubscriptionManagerService;

    public get activatedRoute(): ActivatedRoute {
        return this.get(ActivatedRoute);
    }

    public get backButton(): BackButtonServiceBase {
        return this.get(BLESS_BACK_BUTTON_SERVICE);
    }

    public get busy(): BusyService {
        return this._busy ??= new BusyService();
    }

    public get cdr(): ChangeDetectorRef {
        return this.inject("cdr", ChangeDetectorRef);
    }

    public get formatters(): ValueFormatters {
        return this.get(ValueFormatters);
    }

    public get globalBusy(): BusyService {
        return this.get(BusyService);
    }

    public get globalTimer(): TimerService {
        return this.get(TimerService);
    }

    public get http(): HttpClient {
        return this.inject("http", HttpClient);
    }

    public get iconRegistry(): IconRegistryService {
        return this.get(IconRegistryService);
    }

    public get localStorage(): ILocalStorageService {
        return this.get(BLESS_LOCAL_STORAGE_SERVICE);
    }

    public get notifier(): NotifierService {
        return this.get(NotifierService);
    }

    public get params(): ParamsService {
        return this.get(ParamsService);
    }

    public get router(): Router {
        return this.inject("router", Router);
    }

    public get subscriptionManager(): SubscriptionManagerService {
        return this._subscriptionManager ??= new SubscriptionManagerService();
    }

    public get viewContainerRef(): ViewContainerRef {
        return this.get(ViewContainerRef);
    }

    public get zone(): NgZone {
        return this.inject("zone", NgZone);
    }

    constructor(injector: Injector) {
        super(injector);
    }

    public dispose() {
        if (this._subscriptionManager) {
            this.subscriptionManager.unsubscribeAll();
        }
    }
}