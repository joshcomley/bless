/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @angular-eslint/no-conflicting-lifecycle */
import { AfterContentChecked, AfterContentInit, AfterViewInit, Directive, DoCheck, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from "@angular/core";
import { Services } from "../../services/services/services.service";

@Directive()
export class BaseComponentDirective<TServices extends Services = Services> implements
    OnInit, OnChanges, AfterViewInit, AfterContentInit,
    AfterContentChecked, OnDestroy, DoCheck {
    @Input() public disabled: boolean;
    @Input() public idKey: string;
    @Input() public ignoreDisabled: boolean = false;

    private _destroyed: boolean = false;
    private _services: TServices;
    private _time: number;
    private _viewContainerRef: ViewContainerRef;

    public _notifyChangeSub: any;

    public get destroyed(): boolean {
        return this._destroyed;
    }

    public get isDisabled(): boolean {
        return this.disabled ||
            (!this.ignoreDisabled && this.services.globalBusy.isBusy("disabled"));
    }

    public get services(): TServices {
        return this._services ??= this.resolveServices() as TServices;
    }

    public get uiDisabled(): boolean {
        return this.services.globalBusy.isBusy("disabled");
    }

    public set uiDisabled(value: boolean) {
        this.services.globalBusy.toggleBusy("disabled", value);
    }

    public get viewContainerRef(): ViewContainerRef {
        return this._viewContainerRef ??= this.injector.get(ViewContainerRef);
    }

    constructor(public injector: Injector) {
        this._time = new Date().getTime();
        this.services.subscriptionManager.subscribe(
            this.services.globalBusy.anyBusyChanged,
            _ => {
                // this.services.cdr.detectChanges();
            },
            "disabled"
        );
    }

    // Very short-hand for brevity
    // This is used to ensure form names can be distinct upon
    // each page load. This enables better prevention of unwanted
    // autocomplete interfering with things like Material dropdowns.
    // It can also be used to ensure uniqueness (per class-instance)
    // of any other thing you might want.
    public $(name: string) {
        return `${name}_${this._time}`;
    }

    public ngAfterContentChecked(): void {
    }

    public ngAfterContentInit(): void {
    }

    public ngAfterViewInit(): void {
    }

    public ngDoCheck(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {
    }

    public ngOnDestroy(): void {
        this._destroyed = true;
        this.services.dispose();
    }

    public ngOnInit(): void {
    }

    public notifyChange(justification: string) {
        if (this._notifyChangeSub == null) {
            this._notifyChangeSub = this.services.zone.onStable.subscribe(() => {
                this._notifyChangeSub.unsubscribe();
                this._notifyChangeSub = null;
                this.services.cdr.detectChanges();
            });
        }
    }

    public s(str: string, count: number) {
        return `${str}${(count == 1 ? "" : "s")}`;
    }

    public ss(str: string, count: number) {
        return ` ${this.s(str, count)}`;
    }

    public sss(str: string, count: number) {
        return `${count} ${this.s(str, count)}`;
    }

    public zone(action: () => void) {
        this.services.zone.run(action);
    }

    protected resolveServices(): TServices {
        return new Services(this.injector) as TServices;
    }
}