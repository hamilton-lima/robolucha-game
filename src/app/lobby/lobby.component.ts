import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { DefaultService, ModelJoinMatch, ModelMatch, ModelUserDetails, ModelGameDefinition } from "src/app/sdk";
import { LevelControlService } from "../pages/level-control.service";

import { ModelActiveMatch } from "../sdk/model/modelActiveMatch";
import { UserService } from "src/app/shared/user.service";

import { MatTable } from '@angular/material';
import { int } from 'babylonjs';

export interface IGameData {
  name: string;
  participants: number;
  maxParticipants: number;
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

  @ViewChild(MatTable) table: MatTable<any>;

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
    this.api.privateMatchGet().subscribe((matches: Array<ModelActiveMatch>) => {

      for(let match of matches){
        if(match.type === "multiplayer"){
          const request: ModelJoinMatch = { matchID: match.matchID };
          const name : string = match.name;

          this.api.privateJoinMatchPost(request).subscribe((match: ModelMatch) => {
            const participants : number = match.participants.length;
            const availableMatchID : number = match.availableMatchID;
            const timeServer = match.timeStart.split('');
            const hourServer = Number.parseInt(timeServer[11].concat(timeServer[12]));
            const minuteServe = Number.parseInt(timeServer[14].concat(timeServer[15])) + (hourServer * 60);

            this.api.privateGameDefinitionIdIdGet(match.gameDefinitionID).subscribe((gameDefinition : ModelGameDefinition) =>
            {
              const time = new Date().toString().split('');
              const hour = Number.parseInt(time[16].concat(time[17])) + 3;
              const minute = Number.parseInt(time[19].concat(time[20])) + (hour * 60);
              const minutesEnd : number = (minuteServe + gameDefinition.duration/60000) - minute ;

              this.availableMatches.push({name:name, 
                participants : participants, 
                maxParticipants : gameDefinition.maxParticipants,
                timeLeft:minutesEnd, 
                matchID: availableMatchID, 
                canPlay: this.level.canPlay(this.userDetails, gameDefinition)});

              this.table.renderRows();
            });
            
          });

        }
      }

      console.log(this.availableMatches);
    });

    /*this.api.privateAvailableMatchPublicGet().subscribe((matches: ModelAvailableMatch[]) => {

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

    console.log(this.availableMatches);*/
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
