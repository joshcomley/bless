import { BlessDate } from "./../../../types/date";

export interface DateConverter {
  convert(date: BlessDate): Date;
}
