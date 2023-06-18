import { IInjector } from "../../injector/injector";
import { IValueFormatter } from "../value-formatter.contract";
import { BLESS_DATA_DEFAULT_BOOLEAN_FORMAT } from "./tokens";

export class BooleanFormatterService
  implements IValueFormatter<boolean, string>
{
  public formatTemplate: string = null;

  constructor(
    injector: IInjector
  ) {
    const format = injector.inject<string>(BLESS_DATA_DEFAULT_BOOLEAN_FORMAT);
    this.formatTemplate = format || "Yes/No";
  }

  format(value: boolean, options?: string): string {
    if (options) {
      this.formatTemplate = options;
    }
    return this.normaliseBoolean(value)
      ? this.formatTemplate.split("/")[0]
      : this.formatTemplate.split("/")[1];
  }

  public normaliseBoolean(value: any): boolean {
    if (typeof value === "string") {
      if (value.toLowerCase() === "false") {
        return false;
      }
      if (value.toLowerCase() === "true") {
        return true;
      }
      return false;
    }
    return value as any as boolean;
  }

}
