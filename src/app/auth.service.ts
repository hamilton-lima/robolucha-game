import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environments/environment";

export class LoginResult {
  message: string;
  error: boolean;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {}

  isLoggedIn() {
    return true;
  }

  handleError(error: HttpErrorResponse): Observable<LoginResult> {
    return of({
      message: "Network error, please try again",
      error: true
    });
  }

  setMessage(response: LoginResult) {
    if (response.error) {
      if (!response.message) {
        response.message = "Invalid credentials, please try again";
      }
    }
  }

  login(email: string): Observable<LoginResult> {
    const data = { email: email };

    return this.http
      .post<LoginResult>(environment.apiUrl + "/public/login", data)
      .pipe(
        catchError(this.handleError),
        tap(this.setMessage)
      );
  }
}
