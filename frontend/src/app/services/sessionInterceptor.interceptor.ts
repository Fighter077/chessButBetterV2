import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      const cloned = req.clone({
        headers: req.headers.set("sessionID", sessionID)
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
