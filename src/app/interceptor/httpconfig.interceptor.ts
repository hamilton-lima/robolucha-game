import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthModalMessageComponent } from "./auth-modal-message/auth-modal-message.component";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private modalService: NgbModal){}
    
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
    
  ): Observable<HttpEvent<any>> {

    console.log('Intercept', request);

    return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                console.log('HTTP response: ', event);
            }
            return event;
        }),
        catchError((error: HttpErrorResponse) => {
            let data = {};
            data = {
                reason: error && error.error && error.error.reason ? error.error.reason : '',
                status: error.status
            };
            this.modalService.open(AuthModalMessageComponent, {centered: true});
            console.log('HTTP ERROR response: ', data);
            return throwError(error);
        }));

  }
}
