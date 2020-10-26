import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ModelGameDefinition } from "src/app/sdk";

@Component({
  selector: "app-game-definition-card",
  templateUrl: "./game-definition-card.component.html",
  styleUrls: ["./game-definition-card.component.scss"],
})
export class GameDefinitionCardComponent implements OnInit {
  @Input() gameDefinition: ModelGameDefinition;
  @Output() onEdit = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  getImageName() {
    return "assets/maps/" + this.gameDefinition.name.toLowerCase() + ".png";
  }

  imageErrorHandler(event) {
    event.target.src = "assets/maps/image-not-found.png";
  }

  getIconName() {
    if (this.gameDefinition.type === "multiplayer") {
      return "human-greeting";
    } else {
      return "robot";
    }
  }

  edit() {
    this.onEdit.emit(this.gameDefinition.id);
  }
}
