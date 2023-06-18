import { DateConverter } from "./date-converter.contract";

export interface DateFormatterOptions {
  converter?: DateConverter;
  formatTemplate?: string;
  relative?: boolean;
}
