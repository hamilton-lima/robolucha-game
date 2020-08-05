import { Component, OnInit} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DefaultService, ModelMatch, ModelUserDetails } from "src/app/sdk";
import { ModelGameComponent } from "src/app/sdk/model/mainGameComponent";
import { ShepherdNewService } from "src/app/shepherd-new.service";
import { EventsService } from "src/app/shared/events.service";
import { UserService } from "src/app/shared/user.service";
import Shepherd from "shepherd.js";
import { LevelControlService } from "../level-control.service";
import { ModelAvailableMatch } from "src/app/sdk/model/modelAvailableMatch";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  luchador: ModelGameComponent;
  page: string;
  tour: Shepherd.Tour;

  userDetails: ModelUserDetails;
  multiplayerMatch: ModelAvailableMatch;
  tutorialMatches: ModelAvailableMatch[] = [];

  constructor(
    private router: Router,
    private api: DefaultService,
    private route: ActivatedRoute,
    private shepherd: ShepherdNewService,
    private events: EventsService,
    private userService: UserService,
    private level: LevelControlService) { }

  ngOnInit() {
    this.luchador = this.route.snapshot.data.luchador;
    this.page = this.route.snapshot.url.join("/");
    this.userDetails = this.userService.getUser();

    this.api.privateAvailableMatchPublicGet().subscribe((matches: ModelAvailableMatch[]) => {

      const tutorialMatches: ModelAvailableMatch[] = [];

      console.log('matches', matches);
      matches.forEach(match => {
        // Add extra protection for bad configuration data
        if( match.gameDefinition){
          if (match.gameDefinition.type === "tutorial") {
            tutorialMatches.push(match);
          } else {
            if (this.level.canPlay(this.userDetails, match.gameDefinition)) {
              this.multiplayerMatch = match;
            }
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
    this.events.click(this.page, "customize");
    this.router.navigate(["mask"]);
  }

  lobby() {
    this.router.navigate(["lobby"]);
  }

  help() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "help");
    window.open("https://docs.robolucha.com", "robolucha-docs");
  }

  forum() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "forum");
    window.open("https://forum.robolucha.com", "robolucha-forum");
  }

  playMultiplayer() {
    this.play(this.multiplayerMatch.id);
  }

  play(matchID: number) {
    this.api.privatePlayIdPost(matchID).subscribe((match: ModelMatch) => {
      this.router.navigate(["watch", match.id]);
    });
  }

}
