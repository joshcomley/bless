import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BlessError, IErrorProvider, Logger, UriService } from "@bless/core";
import { HttpResult, IHttpProvider, IHttpRequest, IHttpResult } from "@brandless/iql.data";
import { Interface, Type } from "@brandless/tsutility";
import { lastValueFrom, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class IqlODataHttpService implements IHttpProvider, IErrorProvider {
    public lastError: BlessError;

    constructor(public http: HttpClient) {
    }

    private static FromError(response: HttpErrorResponse): HttpResult {
        var httpResult = new HttpResult(
            async () => response.error,//new Promise<string>(r => r(response.text())),
            async () => response.error,//response.arrayBuffer(),
            async () => response.error,//response.blob(),
            0,
            "",
            false);
        if (!response.status) {
            httpResult.IsOffline = true;
        }
        Logger.IfEnabled(_ => _.log("FromError IsOffline: " + httpResult.IsOffline));
        return httpResult;
    }

    private static FromResponse(response: HttpResponse<any>): HttpResult {
        // return HttpResult.FromNonAsync(
        //     () => response.text(),
        //     () => response.arrayBuffer(),
        //     response.status,
        //     true,
        //     response.headers.get("Content-Type"));
        let httpResult = new HttpResult(
            async () => typeof response.body === "string" ? response.body : JSON.stringify(response.body),//new Promise<string>(r => r(response.text())),
            async () => response.body,//response.arrayBuffer(),
            async () => response.body,//response.blob(),
            response.status,
            response.headers.get("Content-Type"),
            true);
        return httpResult;
    }

    public Delete<TResult>(uri: string, payload: IHttpRequest, TResultType?: Type<TResult> | Interface<TResult>): Promise<IHttpResult> {
        console.log(`DELETE (START): ${decodeURI(uri)}`);
        return this.PerformRequest(options => {
            let startTime = new Date();
            let req = this.http.request(
                "DELETE",
                uri,
                options
            ) as any as Observable<HttpResponse<any>>;
            // req.toPromise().then(_ => {
            //     let endTime = new Date();
            //     let diffInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
            //     console.log(`DELETE (END) (${_.status} - ${_.statusText || "no text"}): ${decodeURI(uri)} (${diffInSeconds}s)`);
            // });
            return req;
        });
    }

    public async Get<TResult>(uri: string, payload: IHttpRequest, TResultType?: Type<TResult> | Interface<TResult>): Promise<IHttpResult> {
        return this.PerformRequest(options => {
            //this.logger.log("GET:");
            //this.logger.log(uri);
            Logger.IfEnabled(() => {
                Logger.Log("GET:");
                Logger.Log(decodeURI(uri));
            });
            console.log(`GET (START): ${decodeURI(uri)}`);
            //this.logger.log("AUTH: " + (options.headers as HttpHeaders).get("Authorization"));
            let exportKind = UriService.GetQueryParameter("export", uri);
            if (exportKind === "excel") {
                options.responseType = "blob";
            }
            let startTime = new Date();
            let req = this.http.request(
                "GET",
                uri,
                options) as any as Observable<HttpResponse<any>>;
            // lastValueFrom(req).then(_ => {
            //     let endTime = new Date();
            //     let diffInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
            //     console.log(`GET (END): ${decodeURI(uri)} (${diffInSeconds}s)`);
            // }, error => {
            //     const err = this.retrieveErrorMessage(error);
            //     console.log("IQL HTTP ERROR:");
            //     console.log(JSON.stringify(err));
            //     this.lastError = err;
            // });
            return req;
        });
    }

    public Post<TResult>(uri: string, payload: IHttpRequest, TResultType?: Type<TResult> | Interface<TResult>): Promise<IHttpResult> {
        console.log(`POST: ${decodeURI(uri)}`);
        return this.PerformRequest(options => {
            options.body = payload.Body;
            //IqlLoggerService.IfEnabled(() => IqlLoggerService.Log("POSTING:"));
            //IqlLoggerService.IfEnabled(() => IqlLoggerService.Log(payload.Body));
            //IqlLoggerService.IfEnabled(() => IqlLoggerService.Log("TO URI:"));
            //IqlLoggerService.IfEnabled(() => IqlLoggerService.Log(uri));
            return this.http.request(
                "POST",
                uri,
                options) as any as Observable<HttpResponse<any>>;
        }, "application/json");
    }

    public Put<TResult>(uri: string, payload: IHttpRequest, TResultType?: Type<TResult> | Interface<TResult>): Promise<IHttpResult> {
        console.log(`PATCH: ${decodeURI(uri)}`);
        return this.PerformRequest(options => {
            options.body = payload.Body;
            //IqlLoggerService.IfEnabled(() => IqlLoggerService.Log("PATCHING::"));
            // Logger.IfEnabled(_ => _.log(payload.Body), true);
            return this.http.request(
                "PATCH",
                uri,
                options) as any as Observable<HttpResponse<any>>;
        }, "application/json");
    }

    // public ResolveBearerToken(): string {
    //     let token = this.oauthContext.oauthProvider.accessToken;
    //     //alert(token == null ? "No token" : token.substr(0, 10));
    //     return token;
    // }
    public ResolveHeaders(bodyContentType: string): HttpHeaders {
        let headers = new HttpHeaders();
        if (bodyContentType) {
            headers = headers.set("Content-Type", bodyContentType);
        }
        // if (this.UseAuthentication()) {
        //     headers = this.SetAuthentication(headers);
        // }
        return headers;
    }

    // public SetAuthentication(headers: HttpHeaders): HttpHeaders {
    //     let token = this.ResolveBearerToken();
    //     headers = headers.set("Authorization", "Bearer " + token);
    //     return headers;
    // }
    protected UseAuthentication(): boolean {
        //isPlatformBrowser(this.platformId)
        return true;
    }

    private async PerformRequest(request: (options: any) => Observable<HttpResponse<any>>, bodyContentType: string = null): Promise<IHttpResult> {
        return new Promise<IHttpResult>(resolve => {
            if (this.UseAuthentication()) {
                request(this.ResolveOptions(bodyContentType))
                    .subscribe(this.ResolveSuccess(resolve), this.ResolveFailure(resolve));
            } else {
                resolve(HttpResult.FromString(null, false));
            }
        });
    }

    private ResolveFailure<TResult>(resolve: (value?: IHttpResult | PromiseLike<IHttpResult>) => void): (error: any) => void {
        return error => {
            // IqlLoggerService.IfEnabled(() => IqlLoggerService.Log("ResolveFailure"));
            resolve(IqlODataHttpService.FromError(error));
        };
    }

    private ResolveOptions(bodyContentType: string): any {
        return {
            headers: this.ResolveHeaders(bodyContentType),
            responseType: "text",
            observe: "response"
        };
    }

    private ResolveSuccess<TResult>(resolve: (value?: IHttpResult | PromiseLike<IHttpResult>) => void): (value: HttpResponse<any>) => void {
        return result => {
            // IqlLoggerService.IfEnabled(() => IqlLoggerService.Log("ResolveSuccess"));
            resolve(IqlODataHttpService.FromResponse(result));
        };
    }

    private retrieveErrorMessage(error: any): BlessError {
        let json: string | null = null;
        let message: string | null = null;
        try {
            json = JSON.stringify(error);
        } catch {
        }
        if (error.error?.message) {
            message = error.error.message;
        }
        return { json, message };
    }
}
