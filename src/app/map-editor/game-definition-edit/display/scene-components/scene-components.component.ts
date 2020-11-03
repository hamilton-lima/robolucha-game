import { Component, Input, OnInit } from "@angular/core";
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { ModelCode, ModelSceneComponent } from "src/app/sdk";
import { SceneComponentBuilderService } from "./scene-component-builder.service";

@Component({
  selector: "app-scene-components",
  templateUrl: "./scene-components.component.html",
  styleUrls: ["./scene-components.component.scss"],
  providers: [SceneComponentBuilderService],
})
export class SceneComponentsComponent implements OnInit {
  @Input() components: ModelSceneComponent[] = [];

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private builder: SceneComponentBuilderService
  ) {}

  ngOnInit() {
    this.mediator.onUpdateSceneComponent.subscribe((component) => {
      // search by id in the list
      for (let key in this.components) {
        if (this.components[key].id == component.id) {
          this.components[key] = component;

          this.mediator.onUpdateSceneComponents.next(this.components);
          break;
        }
      }
    });
  }

  add() {
    this.components.unshift(this.builder.build());
    this.mediator.onUpdateSceneComponents.next(this.components);
  }

  delete(i: number) {
    this.components.splice(i, 1);
    this.mediator.onUpdateSceneComponents.next(this.components);
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

  edit(component: ModelSceneComponent) {
    this.mediator.onEditSceneComponent.next(component);
  }

  formatBlock(component: ModelSceneComponent): string {
    if (component && component.blockMovement) {
      return "blocks";
    }

    return "";
  }
}
