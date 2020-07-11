import { Component, OnInit } from "@angular/core";
import {
  DefaultService, ModelUserDetails, ModelMatch,
} from "src/app/sdk";
import { Router } from "@angular/router";
import { ITourStep, ShepherdNewService } from "src/app/shepherd-new.service";
import { UserService } from "src/app/shared/user.service";
import { timer } from "rxjs";
import Shepherd from "shepherd.js";
import { LevelControlService } from "../level-control.service";
import { forkJoin } from 'rxjs';
import { ModelAvailableMatch } from "src/app/sdk/model/modelAvailableMatch";
import { ModelLevelGroup } from "src/app/sdk/model/modelLevelGroup";

@Component({
  selector: "app-list-public-games",
  templateUrl: "./list-public-games.component.html",
  styleUrls: ["./list-public-games.component.css"],
})
export class ListPublicGamesComponent implements OnInit {
  matches: Array<ModelAvailableMatch> = [];
  tour: Shepherd.Tour;
  userDetails: ModelUserDetails;

  constructor(
    private api: DefaultService,
    private router: Router,
    private shepherd: ShepherdNewService,
    private userService: UserService,
    private level: LevelControlService
  ) {}

  ngOnInit() {
    this.userDetails = this.userService.getUser();
    const observables = [
      this.api.privateLevelGroupGet(),
      this.api.privateAvailableMatchPublicGet()
    ];

    forkJoin( observables ).subscribe((observer: [ModelLevelGroup[], ModelAvailableMatch[]]) => {
      const levelGroups = observer[0];
      const availableMatches = observer[1];

      console.log(levelGroups);

      this.matches = availableMatches.filter((match) =>
          this.level.showAvailableMatch(this.userDetails, match.gameDefinition)
        );
      });

    // Dynamic ids were not update to DOM,
    // forcing this wait before triggering shepperd
    timer(200).subscribe((x) => this.displayContextualHelp());
  }

  readonly steps: ITourStep[] = [
    {
      title: "First time here, tutorial time",
      text:
        'If this is your first time here we suggest you start playing "Move1" tutorial',
      attachTo: { element: "#move1", on: "bottom" },
    },
  ];

  displayContextualHelp() {
    const user = this.userService.getUser();

    if (!user.settings.playedTutorial) {
      this.tour = this.shepherd.show(this.steps);
    }
  }

  play(matchID: number) {
    this.shepherd.done(this.tour);

    this.api.privatePlayIdPost(matchID).subscribe((match: ModelMatch) => {
      this.router.navigate(["watch", match.id]);
    });
  }
}
