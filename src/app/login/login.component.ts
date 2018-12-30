import { Component, OnInit } from "@angular/core";
import { AuthService, LoginResult } from "../auth.service";
import { Router } from "../../../node_modules/@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  email: string;
  loginResult: LoginResult = <LoginResult>{};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  login() {
    console.log("login", this.email);

    this.authService.login(this.email).subscribe((response: LoginResult) => {
      this.loginResult = response;

      if (!response.error) {
        this.router.navigate(["/dashboard"]);
      }
    });
  }
}
