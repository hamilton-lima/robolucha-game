import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MainMatch, DefaultService, MainJoinMatch, MainActiveMatch } from "../sdk";

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.css"]
})
export class PlayComponent implements OnInit {
  matches: Array<MainActiveMatch> = [];

  constructor(private api: DefaultService, private router: Router) {}

  ngOnInit() {
    this.api.privateMatchGet().subscribe((matches: Array<MainActiveMatch>) => {
      console.log("matches", matches);
      this.matches = matches;
    });
  }

  // special behavious for tutorial matches 
  watch(match: MainActiveMatch) {
    if( match.type == "multiplayer"){
      this.joinMultiplayer(match);
    }
    if( match.type == "tutorial"){
      this.joinTutorialMatch(match);
    }
  }

  joinMultiplayer(match: MainActiveMatch) {
    const request: MainJoinMatch = { matchID: match.matchID };
    this.api.privateJoinMatchPost(request).subscribe((match: MainMatch) => {
      console.log("joinned match", match);
      this.router.navigate(["watch", match.id]);
    });
  }

  joinTutorialMatch(match: MainActiveMatch){
    this.api
    .privateStartTutorialMatchNamePost(match.name)
    .subscribe((joinMatch: MainJoinMatch) => {
      console.log("joinned match", match);
      this.router.navigate(["watch", joinMatch.matchID]);
    });
  }
}
