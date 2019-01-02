import { Component, OnInit } from "@angular/core";
import { DefaultService } from "../sdk/api/default.service";
import { MainMatch } from "../sdk/model/mainMatch";
import { MainJoinMatch } from "../sdk/model/mainJoinMatch";

@Component({
  selector: "app-list-matches",
  templateUrl: "./list-matches.component.html",
  styleUrls: ["./list-matches.component.css"]
})
export class ListMatchesComponent implements OnInit {
  matches: Array<MainMatch>;
  constructor(private api: DefaultService) {
    this.matches = [];
  }

  ngOnInit() {
    this.api.privateMatchGet().subscribe((matches: Array<MainMatch>) => {
      console.log("matches", matches);
      this.matches = matches;
    });
  }

  join(match: MainMatch) {
    console.log("join match", match);
    const request: MainJoinMatch = { matchID: match.id };
    this.api.privateJoinMatchPost(request).subscribe((match: MainMatch) => {
      console.log("joinned match", match);
    });
  }
}
