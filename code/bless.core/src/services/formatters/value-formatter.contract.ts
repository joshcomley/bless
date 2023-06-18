export interface IValueFormatter<TValue, TOptions> {
  format(value: TValue, options: TOptions): string;
}
