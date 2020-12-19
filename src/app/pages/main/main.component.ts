import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  DefaultService,
  ModelMatch,
  ModelPlayRequest,
  ModelUserDetails,
} from "src/app/sdk";
import { ModelGameComponent } from "src/app/sdk/model/mainGameComponent";
import { ShepherdNewService } from "src/app/shepherd-new.service";
import { EventsService } from "src/app/shared/events.service";
import { UserService } from "src/app/shared/user.service";
import Shepherd from "shepherd.js";
import { ModelAvailableMatch } from "src/app/sdk/model/modelAvailableMatch";
import { MatDialog } from "@angular/material";
import { JoinClassroomComponent } from "../list-classroom-games/join-classroom/join-classroom.component";
import {
  BoxMenuBarType,
  BoxMenuColor,
  BoxMenuItem,
  BoxMenuStartType,
} from "src/app/shared/box-menu/box-menu.component";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent implements OnInit {
  luchador: ModelGameComponent;
  page: string;
  tour: Shepherd.Tour;

  userDetails: ModelUserDetails;
  multiplayerMatch: ModelAvailableMatch;
  tutorialMatches: ModelAvailableMatch[] = [];

  menuItems: BoxMenuItem[] = [
    {
      backgroundURL: "assets/pages/robolucha-play.gif",
      barType: BoxMenuBarType.Play,
      color: BoxMenuColor.Green,
      label: "Something 1",
      start: BoxMenuStartType.Green,
    },
    {
      backgroundURL: "assets/pages/robolucha-play.gif",
      barType: BoxMenuBarType.Play,
      color: BoxMenuColor.Green,
      label: "Something 2",
      start: BoxMenuStartType.Green,
    },
    {
      backgroundURL: "assets/pages/robolucha-play.gif",
      barType: BoxMenuBarType.Play,
      color: BoxMenuColor.Green,
      label: "Something 3",
      start: BoxMenuStartType.Green,
    },
  ];

  constructor(
    private router: Router,
    private api: DefaultService,
    private route: ActivatedRoute,
    private shepherd: ShepherdNewService,
    private events: EventsService,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.luchador = this.route.snapshot.data.luchador;
    this.page = this.route.snapshot.url.join("/");
    this.userDetails = this.userService.getUser();

    this.api
      .privateAvailableMatchPublicGet()
      .subscribe((matches: ModelAvailableMatch[]) => {
        const tutorialMatches: ModelAvailableMatch[] = [];

        matches.forEach((match) => {
          // Add extra protection for bad configuration data
          if (match.gameDefinition) {
            if (match.gameDefinition.type === "tutorial") {
              tutorialMatches.push(match);
            }
          }
        });

        this.tutorialMatches = tutorialMatches.sort((ma, mb) => {
          const a = ma.gameDefinition.minLevel;
          const b = mb.gameDefinition.minLevel;

          if (a > b) return 1;
          if (b > a) return -1;

          return 0;
        });
      });
  }

  ngAfterViewInit() {
    const user = this.userService.getUser();

    if (!user.settings.visitedMainPage) {
      user.settings.visitedMainPage = true;
      this.userService.updateSettings(user.settings);
    }
  }

  customize() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "customize");
    this.router.navigate(["mask"]);
  }

  lobby() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "lobby");
    this.router.navigate(["lobby"]);
  }

  help() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "help");
    window.open("https://www.robolucha.com/play", "robolucha-docs");
  }

  maps() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "maps");
    this.router.navigate(["maps"]);
  }

  dashboard() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "dashboard");
    this.router.navigate(["dashboard"]);
  }

  join() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "join");
    const dialogRef = this.dialog.open(JoinClassroomComponent);
  }

  classroom() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "classroom");
    this.router.navigate(["classroom"]);
  }

  play(matchID: number) {
    const playRequest = <ModelPlayRequest>{
      availableMatchID: matchID,
      teamID: 0,
    };

    this.api.privatePlayPost(playRequest).subscribe((match: ModelMatch) => {
      this.router.navigate(["watch", match.id]);
    });
  }
}
