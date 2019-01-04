import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { DefaultService, MainLoginResponse, MainLoginRequest, Configuration } from "./sdk";

export class LoginResult {
  message: string;
  error: boolean;
}

const AUTH_UUID_SESSION = "ROBOLUCHA_AUTH_UUID_SESSION";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private api: DefaultService, private configuration: Configuration) {
    const uuid = localStorage.getItem(AUTH_UUID_SESSION);
    console.log("AuthService constructor", uuid);

    if (uuid) {
      this.configuration.apiKeys['Authorization'] = uuid;
    }

  }

  isLoggedIn() {
    const uuid = localStorage.getItem(AUTH_UUID_SESSION);
    console.log("Session uuid", uuid);

    if (uuid) {
      this.configuration.apiKeys['Authorization'] = uuid;
      return true;
    }

    return false;
  }

  handleError(error: HttpErrorResponse): Observable<LoginResult> {
    return of({
      message: "Network error, please try again",
      error: true
    });
  }

  handleResponse(response: MainLoginResponse): LoginResult {
    let result: LoginResult = {
      error: response.error,
      message: ""
    };

    if (response.error) {
      result.message = "Invalid credentials, please try again";
    } else {
      result.message = "You are now connected.";
      console.log("saving Session uuid", response.uuid);
      localStorage.setItem(AUTH_UUID_SESSION, response.uuid);
    }

    return result;
  }

  login(email: string): Observable<LoginResult> {
    let request: MainLoginRequest = { email: email };
    return this.api.publicLoginPost(request).pipe(
      catchError(this.handleError),
      map(this.handleResponse)
    );
  }
}
