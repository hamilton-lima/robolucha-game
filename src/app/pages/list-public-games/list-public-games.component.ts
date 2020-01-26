import { Component, OnInit } from "@angular/core";
import {
  DefaultService,
  ModelActiveMatch,
  ModelAvailableMatch,
  ModelMatch
} from "src/app/sdk";
import { Router } from "@angular/router";
import { ITourStep, ShepherdNewService } from "src/app/shepherd-new.service";
import { UserService } from "src/app/shared/user.service";
import { timer } from 'rxjs';

@Component({
  selector: "app-list-public-games",
  templateUrl: "./list-public-games.component.html",
  styleUrls: ["./list-public-games.component.css"]
})
export class ListPublicGamesComponent implements OnInit {
  matches: Array<ModelAvailableMatch> = [];

  constructor(
    private api: DefaultService,
    private router: Router,
    private shepherd: ShepherdNewService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.api
      .privateAvailableMatchPublicGet()
      .subscribe((matches: Array<ModelAvailableMatch>) => {
        this.matches = matches;
      });

      // Dynamic ids were not update to DOM, 
      // forcing this wait before triggering shepperd
      timer(200).subscribe(x => this.displayContextualHelp());
  }

  readonly steps: ITourStep[] = [
    {
      title: "First time here, tutorial time",
      text:
        'If this is your first time here we suggest you start playing "Move1" tutorial',
      attachTo: { element: "#move1", on: "bottom" }
    }
  ];

  displayContextualHelp() {
    const user = this.userService.getUser();

    if (!user.settings.playedTutorial) {
      this.shepherd.show(this.steps);
    }
  }

  play(matchID: number) {
    this.api.privatePlayIdPost(matchID).subscribe((match: ModelMatch) => {
      this.router.navigate(["watch", match.id]);
    });
  }
}
