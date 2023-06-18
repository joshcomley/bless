import { NgModule } from "@angular/core";
import { BLESS_INJECTOR_SERVICE, BooleanFormatterService, CurrencyFormatterService, DateFormatterService, ValueFormatters } from "@bless/core";

@NgModule({
    providers: [
        {
            provide: ValueFormatters,
            useFactory: (_) => new ValueFormatters(_),
            deps: [BLESS_INJECTOR_SERVICE]
        },
        {
            provide: BooleanFormatterService,
            useFactory: (_) => new BooleanFormatterService(_),
            deps: [BLESS_INJECTOR_SERVICE]
        },
        {
            provide: DateFormatterService,
            useFactory: (_) => new DateFormatterService(_),
            deps: [BLESS_INJECTOR_SERVICE]
        },
        {
            provide: CurrencyFormatterService,
            useFactory: (_) => new CurrencyFormatterService(_),
            deps: [BLESS_INJECTOR_SERVICE]
        }
    ],
})
export class ValueFormattersModule { }
