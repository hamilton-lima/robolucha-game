import { Component, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  DefaultService,
  ModelJoinMatch,
  ModelMatch,
  ModelUserDetails,
  ModelGameDefinition,
  ModelPlayRequest, ModelTeam
} from "src/app/sdk";
import { LevelControlService } from "../pages/level-control.service";

import { ModelAvailableMatch } from "src/app/sdk/model/modelAvailableMatch";
import { UserService } from "src/app/shared/user.service";

import { MatTable } from "@angular/material";
import * as moment from "moment";

export interface IGameData {
  name: string;
  participants: number;
  maxParticipants: number;
  timeLeft: string;
  matchID: number;
  canPlay: boolean;
  duration: number;
  btnText: string;
  teams: ModelTeam[];
  isParticipant: boolean;
}

@Component({
  selector: "app-lobby",
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.scss"],
})
export class LobbyComponent implements OnInit {
  userDetails: ModelUserDetails;
  columns: string[] = ["name", "participants", "timeLeft", "btnJoin"];
  availableMatches: IGameData[] = [];

  constructor(
    private router: Router,
    private api: DefaultService,
    private userService: UserService,
    private level: LevelControlService
  ) {}

  ngOnInit() {
    this.userDetails = this.userService.getUser();
    this.api
      .privateAvailableMatchPublicGet()
      .subscribe((matches: ModelAvailableMatch[]) => {
        const availableMatches: IGameData[] = [];

        matches.forEach((match) => {
          if (match.gameDefinition.type === "multiplayer") {
            availableMatches.push({
              name: match.name,
              participants: 0,
              maxParticipants: match.gameDefinition.maxParticipants,
              timeLeft: "not started",
              matchID: match.id,
              canPlay: this.level.canPlay(
                this.userDetails,
                match.gameDefinition
              ),
              duration: match.gameDefinition.duration,
              btnText: "Start",
              teams: match.gameDefinition.teamDefinition.teams,
              isParticipant: false
            });
          }
        });

        this.availableMatches = availableMatches;

        this.api
          .privateMatchMultiplayerGet()
          .subscribe((matches: ModelMatch[]) => {
            this.availableMatches.forEach((avaiableMatch) => {
              for (let activeMatch of matches) {
                if (avaiableMatch.matchID === activeMatch.availableMatchID) {
                  avaiableMatch.participants = activeMatch.participants.length;
                  avaiableMatch.timeLeft = moment(activeMatch.timeStart)
                    .add(avaiableMatch.duration, "ms")
                    .fromNow();
                  avaiableMatch.btnText = "Rejoin";
                  avaiableMatch.isParticipant = true;
                }
              }
            });
          });
      });
  }

  play(matchID: number, teamID: number) {
    const playRequest = <ModelPlayRequest>{
      availableMatchID: matchID,
      teamID: teamID
    };

    this.api.privatePlayPost(playRequest).subscribe((match: ModelMatch) => {
      this.router.navigate(["watch", match.id]);
    });
  }
}
