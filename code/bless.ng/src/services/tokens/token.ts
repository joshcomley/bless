import { BlessValueResolver } from "@bless/core";
import { BlessAppConfigToken } from "./app-config-token";

export type BlessInjectionToken<T> =
  | T
  | BlessAppConfigToken
  | BlessValueResolver<T>;
