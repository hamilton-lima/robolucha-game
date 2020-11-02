import { Component, Input, OnInit } from "@angular/core";
import {
  GameDefinitionEditMediatorService,
  ModelSceneComponentEditWrapper,
} from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import {
  ModelCode,
  ModelSceneComponent,
} from "src/app/sdk";
import { SceneComponentBuilderService } from "./scene-component-builder.service";

@Component({
  selector: "app-scene-components",
  templateUrl: "./scene-components.component.html",
  styleUrls: ["./scene-components.component.scss"],
})
export class SceneComponentsComponent implements OnInit {
  @Input() components: ModelSceneComponent[];

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private builder: SceneComponentBuilderService
  ) {}

  wrapped: ModelSceneComponentEditWrapper[];

  ngOnInit() {
    this.wrapped = this.builder.buildWrapperList(this.components);
    this.mediator.onUpdateSceneComponent.subscribe((wrapper) => {
      // search by id in the list
      for (let key in this.wrapped) {
        if (this.wrapped[key].id == wrapper.id) {
          this.wrapped[key].component = wrapper.component;
          console.log("found and updated", this.wrapped[key]);

          this.mediator.onUpdateSceneComponents.next(
            this.builder.unWrapList(this.wrapped)
          );
          break;
        }
      }
    });
  }

  add() {
    if (this.wrapped) {
      this.wrapped.unshift(this.builder.buildWrapper(this.builder.build()));
      this.mediator.onUpdateSceneComponents.next(
        this.builder.unWrapList(this.wrapped)
      );
    }
  }

  delete(i: number) {
    if (this.wrapped) {
      this.wrapped.splice(i, 1);
      this.mediator.onUpdateSceneComponents.next(
        this.builder.unWrapList(this.wrapped)
      );
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

  edit(component: ModelSceneComponentEditWrapper) {
    this.mediator.onEditSceneComponent.next(component);
  }
}
