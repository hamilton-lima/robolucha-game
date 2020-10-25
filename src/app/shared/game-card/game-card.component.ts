import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ModelUserDetails } from "src/app/sdk";
import { ModelAvailableMatch } from "src/app/sdk/model/modelAvailableMatch";
import { LevelControlService } from "src/app/shared/level-control.service";

@Component({
  selector: "app-game-card",
  templateUrl: "./game-card.component.html",
  styleUrls: ["./game-card.component.css"]
})
export class GameCardComponent implements OnInit {
  @Input() match: ModelAvailableMatch;
  @Input() componentId: string;
  @Input() userDetails: ModelUserDetails;

  @Output() onplay = new EventEmitter<number>();

  constructor(private level: LevelControlService) {}

  ngOnInit() {}

  getImageName(match: ModelAvailableMatch) {
    return "assets/maps/" + match.name.toLowerCase() + ".png";
  }

  imageErrorHandler(event){
    event.target.src = "assets/maps/image-not-found.png";
  }

  canPlay(){
    return this.level.canPlay(this.userDetails, this.match.gameDefinition);
  }

  getIconName(match: ModelAvailableMatch) {
    // console.log("match.gameDefinition.type", match.gameDefinition.type);

    if (match.gameDefinition.type === "multiplayer") {
      return "human-greeting";
    } else {
      return "robot";
    }
  }

  play(matchID: number) {
    // console.log("play", matchID);
    this.onplay.emit(matchID);
  }
}
