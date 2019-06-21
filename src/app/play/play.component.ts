import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MainMatch, DefaultService, MainJoinMatch } from "../sdk";

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.css"]
})
export class PlayComponent implements OnInit {
  matches: Array<MainMatch> = [];

  constructor(private api: DefaultService, private router: Router) {}

  ngOnInit() {
    this.api.privateMatchGet().subscribe((matches: Array<MainMatch>) => {
      console.log("matches", matches);
      this.matches = matches;
    });
  }

  watch(match: MainMatch) {
    const request: MainJoinMatch = { matchID: match.id };
    this.api.privateJoinMatchPost(request).subscribe((match: MainMatch) => {
      console.log("joinned match", match);
      this.router.navigate(["watch", match.id]);
    });
  }
}
