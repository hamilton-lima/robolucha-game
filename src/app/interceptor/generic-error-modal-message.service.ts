import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericErrorModalMessageService {
  errors: Subject<HttpErrorResponse> = new Subject();

  addError(error: HttpErrorResponse) {
    this.errors.next(error);
  }

  constructor() { }
}
