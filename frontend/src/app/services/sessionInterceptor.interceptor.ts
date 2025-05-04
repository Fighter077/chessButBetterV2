import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CookiesService } from "./cookies/cookies.service";

@Injectable()
export class SessionInterceptor implements HttpInterceptor {

  constructor(private cookiesService: CookiesService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sessionID = this.cookiesService.getCookie("sessionID");

    if (sessionID) {
      const cloned = req.clone({
        headers: req.headers.set("sessionID", sessionID)
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
