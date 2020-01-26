import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ModelAvailableMatch } from "src/app/sdk";

@Component({
  selector: "app-game-card",
  templateUrl: "./game-card.component.html",
  styleUrls: ["./game-card.component.css"]
})
export class GameCardComponent implements OnInit {
  @Input() match: ModelAvailableMatch;
  @Input() componentId: string;
  
  @Output() onplay = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  getImageName(match: ModelAvailableMatch) {
    return "assets/maps/" + match.name.toLowerCase() + ".png";
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
