import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModelMatch, DefaultService, ModelJoinMatch, ModelActiveMatch } from "../sdk";

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.css"]
})
export class PlayComponent implements OnInit {
  matches: Array<ModelActiveMatch> = [];

  constructor(private api: DefaultService, private router: Router) {}

  ngOnInit() {
    this.api.privateMatchGet().subscribe((matches: Array<ModelActiveMatch>) => {
      // console.log("matches", matches);
      this.matches = matches;
    });
  }

  // special behavious for tutorial matches 
  watch(match: ModelActiveMatch) {
    if( match.type == "multiplayer"){
      this.joinMultiplayer(match);
    }
    if( match.type == "tutorial"){
      this.joinTutorialMatch(match);
    }
  }

  joinMultiplayer(match: ModelActiveMatch) {
    const request: ModelJoinMatch = { matchID: match.matchID };
    this.api.privateJoinMatchPost(request).subscribe((match: ModelMatch) => {
      // console.log("joinned match", match);
      this.router.navigate(["watch", match.id]);
    });
  }

  joinTutorialMatch(match: ModelActiveMatch){
    // this.api
    // .privateStartTutorialMatchNamePost(match.name)
    // .subscribe((joinMatch: ModelJoinMatch) => {
    //   // console.log("joinned match", match);
    //   this.router.navigate(["watch", joinMatch.matchID]);
    // });
  }
}
