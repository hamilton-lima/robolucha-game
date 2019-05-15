import { Injectable } from "@angular/core";
import { DefaultService } from "./sdk";

export class LoginResult {
  message: string;
  error: boolean;
}

@Injectable()
export class AuthService {
  constructor(private api: DefaultService) {
  }

  isLoggedIn() {
    return this.api.privateGetUserGet();
  }

}
