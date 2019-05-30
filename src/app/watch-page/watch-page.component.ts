import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  ActivatedRoute
} from "@angular/router";
import { DefaultService, MainGameDefinition, MainGameComponent } from "../sdk";
import { WatchMatchComponent } from "../watch-match/watch-match.component";

@Component({
  selector: "app-watch-page",
  templateUrl: "./watch-page.component.html",
  styleUrls: ["./watch-page.component.css"]
})
export class WatchPageComponent implements OnInit, CanComponentDeactivate {
  constructor(
    private router: Router,
    private api: DefaultService,
    private route: ActivatedRoute
  ) {}

  matchID: number;
  luchador: MainGameComponent;
  gameDefinition: MainGameDefinition;

  @ViewChild(WatchMatchComponent) watchMatch: WatchMatchComponent;

  ngOnInit(): void {
    this.luchador = this.route.snapshot.data.luchador;
    this.matchID = Number.parseInt(this.route.snapshot.paramMap.get("id"));
    console.log("match ID", this.matchID);
    console.log("luchador", this.luchador);

    this.api.privateMatchSingleGet(this.matchID).subscribe(match => {
      this.api
        .privateGameDefinitionIdIdGet(match.gameDefinitionID)
        .subscribe(gameDefinition => {
          this.gameDefinition = gameDefinition;
          console.log("gamedefinition", this.gameDefinition);
        });
    });
  }

  endMatch() {
    this.router.navigate(["play"]);
  }

  canDeactivate() {
    if (this.watchMatch.codeEditor.dirty) {
      return window.confirm(
        "You have unsaved changes to your luchador code. Are you sure you want to leave?"
      );
    }
    return true;
  }

}
