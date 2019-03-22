import { Component, OnInit } from "@angular/core";
import { AuthService, LoginResult } from "../auth.service";
import { Router } from "../../../node_modules/@angular/router";
import { NMSColor, Color } from "../color-picker/nmscolor";
import { QuoteService, Quote } from "../quote.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  email: string;
  loginResult: LoginResult = <LoginResult>{};
  colors;
  quoteColor : Color;
  quotes : Array<Quote>;
  quote : Quote;

  constructor(private authService: AuthService, private router: Router,private nmsColors:NMSColor, private quoteService:QuoteService) {
    this.colors = nmsColors.allColors;
    this.quotes = quoteService.allQuotes;
  }

  ngOnInit() {
    this.quoteColor = this.pickRandomElement(this.colors).color;
    this.quote = this.pickRandomElement(this.quotes);
    // console.log(this.quoteColor);
  }
  pickRandomElement(arr){
    var rand;
    rand = Math.floor(Math.random() * Math.floor(arr.length-1));
    return arr[rand];
  }
  login() {
    console.log("login", this.email);

    this.authService.login(this.email).subscribe((response: LoginResult) => {
      this.loginResult = response;

      if (!response.error) {
        this.router.navigate(["/luchador"]);
      }
    });
  }
}
