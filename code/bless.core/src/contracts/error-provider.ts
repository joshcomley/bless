export type BlessError = {
  json: string;
  message: string;
}

export interface IErrorProvider {
  lastError: BlessError;
}
