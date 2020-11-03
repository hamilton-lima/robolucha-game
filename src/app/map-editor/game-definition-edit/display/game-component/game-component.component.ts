import { Component, Input, OnInit } from "@angular/core";
import { ModelCode, ModelGameComponent } from "src/app/sdk";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";
import { GameComponentBuildService } from "./game-component-build.service";

@Component({
  selector: "app-game-component",
  templateUrl: "./game-component.component.html",
  styleUrls: ["./game-component.component.scss"],
  providers: [GameComponentBuildService],
})
export class GameComponentComponent implements OnInit {
  @Input() components: ModelGameComponent[] = [];

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private builder: GameComponentBuildService
  ) {}
  ngOnInit() {
    this.mediator.onUpdateGameComponent.subscribe((component) => {
      // search by id in the list
      for (let key in this.components) {
        if (this.components[key].id == component.id) {
          this.components[key] = component;

          this.mediator.onUpdateGameComponents.next(this.components);
          break;
        }
      }
    });
  }

  add() {
    this.components.unshift(this.builder.build());
    this.mediator.onUpdateGameComponents.next(this.components);
  }

  delete(i) {
    this.components.splice(i, 1);
    this.mediator.onUpdateGameComponents.next(this.components);
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

  edit(component: ModelGameComponent) {
    this.mediator.onEditGameComponent.next(component);
  }
}
