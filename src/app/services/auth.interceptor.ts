import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}


  // MY ANGULAR MIDDLEWARE :) responsible to attach the jwt token to every http needed.
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    if (req.url.includes('/authenticate')) { // Login request (no token needed)
        return next.handle(req);
  }

    if (token) {
      const cloned = req.clone({ // clone the request and add the jwt token to send in header
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

    //   console.log('Sending request to : ', cloned.url);
    //   console.log('token : ', token);

      return next.handle(cloned); // send the request with the header
    }

    return next.handle(req); // no need to attach anything
  }
}
