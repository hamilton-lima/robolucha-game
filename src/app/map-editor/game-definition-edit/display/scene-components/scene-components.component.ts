import { Component, Input, OnInit } from "@angular/core";
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { ModelCode, ModelSceneComponent } from "src/app/sdk";
import { SceneComponentBuilderService } from "./scene-component-builder.service";
import { Pickable } from "src/app/arena/arena.component";
import { Subject } from "rxjs";

@Component({
  selector: "app-scene-components",
  templateUrl: "./scene-components.component.html",
  styleUrls: ["./scene-components.component.scss"],
  providers: [SceneComponentBuilderService],
})
export class SceneComponentsComponent implements OnInit {
  @Input() components: ModelSceneComponent[] = [];
  @Input() pickElement : Subject<Pickable>;
  current : string;
  

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

    if (this.pickElement) {
      this.pickElement.subscribe((target: Pickable) => {
      if(target.event == 'down'){
        for (let key in this.components) {
          if (target.id != null && this.components[key].id == target.id) {
            this.current = key;
            break;
          }
        }
      }else if(this.components[this.current] != null && target.event == 'move'){
            this.components[this.current].x = target.point.x;
            this.components[this.current].y = target.point.z;
            //this.components[this.current].z = target.point.y;
            this.mediator.onUpdateSceneComponents.next(this.components);
      }else if(this.components[this.current] != null && target.event == 'up'){
            this.current = null;
      }
      });
    }
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
