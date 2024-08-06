import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { OptionsService } from "../../options/options.service";
import { IValueFormatter } from "../value-formatter.contract";
import { DateConverter } from "./date-converter.contract";
import { DateFormatterOptions } from "./date-formatter.options";
import { BlessDate } from "../../../types/date";
import { IInjector } from "../../injector/injector";
import {
  BLESS_DATA_DEFAULT_DATE_CONVERTER,
  BLESS_DATA_DEFAULT_DATE_FORMAT
} from "./tokens";

export class DateFormats {
  public static Date: string = "MMMM D, YYYY";
  public static DateTime: string = "MMMM D, YYYY HH:mm:ss";
  public static Time: string = "HH:mm:ss";
}

class DefaultDateConverter implements DateConverter {
  public convert(date: BlessDate): Date {
    return dayjs(date).toDate();
  }
}

class DefaultDateFormatterOptions implements DateFormatterOptions {
  private _converter: DateConverter = new DefaultDateConverter();

  public get converter(): DateConverter {
    return this._converter;
  }

  public get formatTemplate(): string {
    return DateFormats.DateTime;
  }
}

export class DateFormatterService
  implements
  DateFormatterOptions,
  IValueFormatter<BlessDate, DateFormatterOptions>
{
  private static DefaultOptionsInternal: DateFormatterOptions =
    new DefaultDateFormatterOptions();

  public static get DefaultOptions(): DateFormatterOptions {
    return DateFormatterService.DefaultOptionsInternal;
  }

  public formatTemplate?: string;
  public converter?: DateConverter
  constructor(injector: IInjector) {
    this.formatTemplate = injector.inject(BLESS_DATA_DEFAULT_DATE_FORMAT, null);
    this.converter = injector.inject(BLESS_DATA_DEFAULT_DATE_CONVERTER, null);
  }

  public format(value: BlessDate, options?: DateFormatterOptions): string {
    if (!value) {
      return "";
    }
    try {
      options = new OptionsService<DateFormatterOptions>()
        .addProviders(options, this, DateFormatterService.DefaultOptions)
        .build();
      const convertedValue = options.converter.convert(value);
      if (options?.relative === true) {
        dayjs.extend(relativeTime);
        return dayjs(convertedValue).fromNow();
      }
      return dayjs(convertedValue).format(options.formatTemplate);
    } catch {
      return "";
    }
  }
}
