import { Component, OnInit } from "@angular/core";
import {
  DefaultService,
  ModelActiveMatch,
  ModelAvailableMatch,
  ModelMatch
} from "src/app/sdk";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-public-games",
  templateUrl: "./list-public-games.component.html",
  styleUrls: ["./list-public-games.component.css"]
})
export class ListPublicGamesComponent implements OnInit {
  matches: Array<ModelAvailableMatch> = [];

  constructor(private api: DefaultService, private router: Router) {}

  ngOnInit() {
    this.api
      .privateAvailableMatchPublicGet()
      .subscribe((matches: Array<ModelAvailableMatch>) => {
        console.log("matches", matches);
        this.matches = matches;
      });
  }

  play(matchID: number) {
    console.log("play", matchID);
    this.api.privatePlayIdPost(matchID).subscribe((match: ModelMatch) => {
      console.log("joinned match", match);
      this.router.navigate(["watch", match.id]);
    });
  }


}
