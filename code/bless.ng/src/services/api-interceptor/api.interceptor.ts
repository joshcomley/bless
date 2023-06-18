import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServicesProvider } from "./../services/services-provider.service";
import { ApiInterceptorDependencies } from "./api.interceptor.dependencies";

@Injectable({
  providedIn: "root",
})
export abstract class ApiInterceptor implements HttpInterceptor {
  protected deps: ApiInterceptorDependencies;

  public get baseUrl(): string {
    return this.deps.tokenResolver.resolveValue(this.deps.baseUrlToken);
  }

  constructor(protected injector: ServicesProvider) {
    this.deps = injector.get(ApiInterceptorDependencies);
  }

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!!this.baseUrl && this.isApiUrl(req)) {
      return this.interceptApiRequest(req, next);
    }
    return next.handle(req);
  }

  public abstract interceptApiRequest(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>>;

  protected isApiUrl(req: any): boolean {
    // Leave this for debugging
    // console.log(`URL (iframe: ${window.location !== window.parent.location}): ${req.url}`);

    // It's an absolute url with the same origin.
    if (req.url.startsWith(this.baseUrl)) {
      return true;
    }

    // It's a protocol relative url with the same origin.
    // For example: //www.example.com/api/Products
    if (req.url.startsWith(`//${this.baseUrl}/`)) {
      return true;
    }

    // It's an absolute or protocol relative url that
    // doesn't have the same origin.
    return false;
  }
}
