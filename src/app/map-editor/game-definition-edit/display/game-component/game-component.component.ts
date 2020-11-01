import { Component, Input, OnInit } from "@angular/core";
import {
  ModelCode,
  ModelGameComponent,
  ModelGameDefinition,
} from "src/app/sdk";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";
import { GameComponentBuildService } from "./game-component-build.service";

@Component({
  selector: "app-game-component",
  templateUrl: "./game-component.component.html",
  styleUrls: ["./game-component.component.scss"],
})
export class GameComponentComponent implements OnInit {
  @Input() components: ModelGameComponent[];

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private builder: GameComponentBuildService
  ) {}
  ngOnInit() {}

  add() {
    if (this.components) {
      this.components.unshift(this.builder.build());
      this.mediator.onUpdateGameComponents.next(this.components);
    }
  }

  delete(i) {
    if (this.components) {
      this.components.splice(i, 1);
      this.mediator.onUpdateGameComponents.next(this.components);
    }
  }

  formatCodes(codes: ModelCode[]) {
    if (!codes) {
      return "";
    }

    let result = [];
    codes.forEach((code) => {
      if (code && code.script) {
        result.push(code.event);
      }
    });
    return result;
  }

  edit(component: ModelGameComponent){
      this.mediator.onEditGameComponent.next(component);
  }
}
