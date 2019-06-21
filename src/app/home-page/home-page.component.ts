import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"]
})
export class HomePageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("robolucha-last-visit")) {
      this.router.navigate(["play"]);
    } else {
      const now = (new Date()).getTime().toString();
      localStorage.setItem("robolucha-last-visit", now);
      this.router.navigate(["play"]);
    }
  }
}
