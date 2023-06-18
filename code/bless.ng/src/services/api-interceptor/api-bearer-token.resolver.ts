import { AsyncType } from "@bless/core";

export interface BlessBearerTokenResolver {
    resolve(): AsyncType<string>
}