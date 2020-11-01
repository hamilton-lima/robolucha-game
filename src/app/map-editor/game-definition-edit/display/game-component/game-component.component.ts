import { Component, Input, OnInit } from "@angular/core";
import {
  ModelCode,
  ModelGameComponent,
  ModelGameDefinition,
} from "src/app/sdk";
import {
  GameDefinitionEditMediatorService,
  ModelGameComponentEditWrapper,
} from "../../game-definition-edit-mediator.service";
import { GameComponentBuildService } from "./game-component-build.service";

@Component({
  selector: "app-game-component",
  templateUrl: "./game-component.component.html",
  styleUrls: ["./game-component.component.scss"],
})
export class GameComponentComponent implements OnInit {
  @Input() components: ModelGameComponent[];
  wrapped: ModelGameComponentEditWrapper[];

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private builder: GameComponentBuildService
  ) {}
  ngOnInit() {
    this.wrapped = this.builder.buildWrapperList(this.components);
    this.mediator.onUpdateGameComponent.subscribe((wrapper) => {
      // search by id in the list
      const found = this.wrapped.find((one) => one.id == wrapper.id);
      if (found) {
        found.component = wrapper.component;

        // notify list update
        this.mediator.onUpdateGameComponents.next(
          this.builder.unWrapList(this.wrapped)
        );
      }
    });
  }

  add() {
    if (this.wrapped) {
      this.wrapped.unshift(this.builder.buildWrapper(this.builder.build()));
      this.mediator.onUpdateGameComponents.next(
        this.builder.unWrapList(this.wrapped)
      );
    }
  }

  delete(i) {
    if (this.wrapped) {
      this.wrapped.splice(i, 1);
      this.mediator.onUpdateGameComponents.next(
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

  edit(component: ModelGameComponentEditWrapper) {
    this.mediator.onEditGameComponent.next(component);
  }
}
