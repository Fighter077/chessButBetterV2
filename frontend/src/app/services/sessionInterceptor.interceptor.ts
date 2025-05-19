import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CookiesService } from "./cookies/cookies.service";

@Injectable()
export class SessionInterceptor implements HttpInterceptor {

  constructor(private cookiesService: CookiesService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable<HttpEvent<any>>(observer => {
      this.cookiesService.getCookie("sessionID").then(sessionID => {
        let requestToHandle = req;
        if (sessionID) {
          requestToHandle = req.clone({
            headers: req.headers.set("sessionID", sessionID)
          });
        }
        next.handle(requestToHandle).subscribe({
          next: event => observer.next(event),
          error: err => observer.error(err),
          complete: () => observer.complete()
        });
      }).catch(err => observer.error(err));
    });
  }
}
