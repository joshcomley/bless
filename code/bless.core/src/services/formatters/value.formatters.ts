import { IInjector } from "@bless/core";
import { BooleanFormatterService } from "./boolean-formatter";
import { CurrencyFormatterService } from "./currency-formatter";
import { DateFormatterService } from "./date-formatter";

export class ValueFormatters {
  private _date: DateFormatterService;
  private _bool: BooleanFormatterService;
  private _currency: CurrencyFormatterService;

  public get date(): DateFormatterService {
    return (this._date = this._date || this.injector.inject(DateFormatterService));
  }

  public get bool(): BooleanFormatterService {
    return (this._bool =
      this._bool || this.injector.inject(BooleanFormatterService));
  }

  public get currency(): CurrencyFormatterService {
    return (this._currency =
      this._currency || this.injector.inject(CurrencyFormatterService));
  }
  constructor(private injector: IInjector) { }
}
