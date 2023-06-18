import { Inject, Injectable } from "@angular/core";
import { BLESS_API_BASE_URL } from "../../tokens";
import { BlessTokenResolverService } from "../token-resolver";
import { BlessInjectionToken } from "../tokens";

@Injectable({ providedIn: "root" })
export class ApiInterceptorDependencies {
  constructor(
    public tokenResolver: BlessTokenResolverService,
    @Inject(BLESS_API_BASE_URL) public baseUrlToken: BlessInjectionToken<string>
  ) {
  }
}
