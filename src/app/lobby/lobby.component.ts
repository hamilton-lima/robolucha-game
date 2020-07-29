import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { DefaultService, ModelMatch, ModelUserDetails } from "src/app/sdk";
import { LevelControlService } from "../pages/level-control.service";
import { ModelAvailableMatch } from "src/app/sdk/model/modelAvailableMatch";
import { UserService } from "src/app/shared/user.service";

export interface IGameData {
  name: string;
  participants: number;
  timeLeft: number;
  matchID: number;
  canPlay: boolean;
}

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  userDetails: ModelUserDetails;
  columns: string[] = ['name', 'participants', 'timeLeft', 'btnJoin'];
  availableMatches : IGameData[] = [];

  constructor(
    private router: Router,
    private api: DefaultService,
    private userService: UserService,
    private level: LevelControlService) { }

  ngOnInit() {

    this.userDetails = this.userService.getUser();
    this.api.privateAvailableMatchPublicGet().subscribe((matches: ModelAvailableMatch[]) => {

      const availableMatches : IGameData[] = [];

      matches.forEach(match => {
        if (match.gameDefinition.type === "multiplayer") {
          availableMatches.push({name:match.name, 
                                participants : 10, 
                                timeLeft:10, 
                                matchID: match.id, 
                                canPlay: this.level.canPlay(this.userDetails, match.gameDefinition)});
        }
      });
      this.availableMatches = availableMatches;
    });
  }

  getColorButton(canPlay: boolean){
    return canPlay ? "primary" : "warn";
  }

  getTipButton(canPlay : boolean){
    return canPlay ? "" : "You don't have level";
  }
  
  play(matchID: number, canPlay : boolean) {
    if(!canPlay)
    return;

    this.api.privatePlayIdPost(matchID).subscribe((match: ModelMatch) => {
      this.router.navigate(["watch", match.id]);
    });
  }

}
