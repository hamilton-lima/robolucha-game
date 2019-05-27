import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MainMatch } from "../sdk";

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.css"]
})
export class PlayComponent {

  constructor(private router: Router) {}

  watch(match: MainMatch){
    this.router.navigate(["watch", match.id]);
  }
}
