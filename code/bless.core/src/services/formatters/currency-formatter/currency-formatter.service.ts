import { IInjector } from "../../injector/injector";
import { IValueFormatter } from "../value-formatter.contract";
import {
  BLESS_DATA_DEFAULT_CURRENCY_LOCALE,
  BLESS_DATA_DEFAULT_CURRENCY_SYMBOL
} from "./tokens";

export class CurrencyFormatterService
  implements IValueFormatter<any, string>
{
  public locale: string = null;
  public symbol: string = null;

  constructor(injector: IInjector) {
    const locale = injector.inject<string>(BLESS_DATA_DEFAULT_CURRENCY_LOCALE);
    this.locale = locale || "en-gb";
    const symbol = injector.inject<string>(BLESS_DATA_DEFAULT_CURRENCY_SYMBOL);
    this.symbol = symbol || "£";
  }

  public format(value: any, options?: string): string {
    value ??= 0;
    if (typeof value !== "number") {
      try {
        value = parseFloat(value);
      } catch {
        value = 0;
      }
    }
    try {
      return "NOT IMPLEMENTED";//formatCurrency(value, this.locale, this.symbol);
    } catch {
      return "";
    }
  }
}
