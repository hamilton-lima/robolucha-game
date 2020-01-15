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
import { GenericErrorModalMessageComponent } from "./generic-error-modal-message/generic-error-modal-message.component";
import { GenericErrorModalMessageService } from "./generic-error-modal-message.service";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private modalService: NgbModal, private errorService: GenericErrorModalMessageService){}
    
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
    
  ): Observable<HttpEvent<any>> {

    // // console.log('Intercept', request);

    return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
            return event;
        }),
        
        catchError((error: HttpErrorResponse) => {
            let data = {};
            data = {
                reason: error && error.error && error.error.reason ? error.error.reason : '',
                status: error.status
            };
            
            if( error.status == 403 ){
              this.modalService.open(AuthModalMessageComponent, {centered: true});
            } else {
              this.modalService.open(GenericErrorModalMessageComponent, {centered: true});
              this.errorService.addError(error);
            }
            
            console.log('HTTP ERROR response: ', data);
            return throwError(error);
        }));

  }
}
