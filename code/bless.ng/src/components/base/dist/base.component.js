"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BaseComponentDirective = void 0;
var core_1 = require("@angular/core");
var services_service_1 = require("../../services/services/services.service");
var BaseComponentDirective = /** @class */ (function () {
    function BaseComponentDirective(injector) {
        this.injector = injector;
    }
    Object.defineProperty(BaseComponentDirective.prototype, "services", {
        get: function () {
            var _a;
            return (_a = this._services) !== null && _a !== void 0 ? _a : ;
            this.resolveServices();
        },
        enumerable: false,
        configurable: true
    });
    BaseComponentDirective.prototype.resolveServices = function () {
        return new services_service_1.Services(this.injector);
    };
    BaseComponentDirective.prototype.ngAfterContentChecked = function () {
    };
    BaseComponentDirective.prototype.ngAfterContentInit = function () {
    };
    BaseComponentDirective.prototype.ngAfterViewInit = function () {
    };
    BaseComponentDirective.prototype.ngOnChanges = function (changes) {
    };
    BaseComponentDirective.prototype.ngOnDestroy = function () {
    };
    BaseComponentDirective.prototype.ngOnInit = function () {
    };
    BaseComponentDirective.prototype.ngDoCheck = function () {
    };
    BaseComponentDirective.prototype.notifyChange = function (justification) {
        this.services.cdr.markForCheck();
    };
    BaseComponentDirective = __decorate([
        core_1.Directive()
    ], BaseComponentDirective);
    return BaseComponentDirective;
}());
exports.BaseComponentDirective = BaseComponentDirective;
