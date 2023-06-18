import { DateConverter } from "./date-converter.contract";
import { InjectionToken } from "../../injector/injector";

export const BLESS_DATA_DEFAULT_DATE_FORMAT = new InjectionToken<string>(
    "BLESS_DATA_DEFAULT_DATE_FORMAT"
);
export const BLESS_DATA_DEFAULT_DATE_CONVERTER =
    new InjectionToken<DateConverter>("BLESS_DATA_DEFAULT_DATE_CONVERTER");
