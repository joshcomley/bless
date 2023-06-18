import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AsyncService } from "@bless/core";
import { ServicesProvider } from "@bless/ng";
import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { BlessBearerTokenResolver } from "./api-bearer-token.resolver";
import { ApiInterceptor } from "./api.interceptor";
import { BLESS_API_BEARER_TOKEN_RESOLVER } from "./tokens";

@Injectable({
    providedIn: "root",
})
export class ApiBearerInterceptor extends ApiInterceptor {
    private get tokenResolver(): BlessBearerTokenResolver {
        return this.injector.get(BLESS_API_BEARER_TOKEN_RESOLVER, null);
    }

    constructor(injector: ServicesProvider) {
        super(injector);
    }

    public interceptApiRequest(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!this.tokenResolver) {
            return next.handle(req);
        }
        return AsyncService.ToObservable(this.tokenResolver.resolve())
            .pipe(mergeMap(token => this.processRequestWithToken(token, req, next)));
    }

    // Checks if there is an access_token available in the authorize service
    // and adds it to the request in case it's targeted at the same origin as the
    // single page application.
    private processRequestWithToken(
        token: string,
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!!token && !!this.baseUrl && this.isApiUrl(req)) {
            const uri = decodeURIComponent(decodeURI(req.urlWithParams));
            console.log(`URL: ${uri}`);
            const headers = {
                Authorization: `Bearer ${token}`,
            } as any;
            req = req.clone({
                setHeaders: headers,
            });
        }

        return next.handle(req);
    }
}
