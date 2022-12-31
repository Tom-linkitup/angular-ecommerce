import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    // only add an access token for secured endpoints
    const securedEndPoints = ['http://localhost:8080/api/orders'];
    if (securedEndPoints.some(url => req.urlWithParams.includes(url))) {
      // get access token
      const token = this.oktaAuth.getAccessToken();
      // clone the request and add access into header
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    return await lastValueFrom(next.handle(req));
  }
}
