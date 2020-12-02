import { Component, Input, OnInit } from "@angular/core";
import { ModelGameDefinition, ModelNarrativeDefinition } from "src/app/sdk";
import {
  NarrativeDialogService,
  NarrativeServiceService,
} from "src/app/watch-page/narrative/narrative-dialog.service";
import { NarrativeBuilderService } from "../../editor/narrative-builder.service";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";

@Component({
  selector: "app-narrative",
  templateUrl: "./narrative.component.html",
  styleUrls: ["./narrative.component.scss"],
})
export class NarrativeComponent implements OnInit {
  @Input() narratives: Array<ModelNarrativeDefinition>;

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private builder: NarrativeBuilderService,
    private service: NarrativeDialogService
  ) {}

  edit(narrative: ModelNarrativeDefinition) {
    this.mediator.onEditNarrative.next(narrative);
  }

  ngOnInit() {
    this.mediator.onUpdateNarrative.subscribe((narrative) => {
      // search by id in the list
      for (let key in this.narratives) {
        if (this.narratives[key].id == narrative.id) {
          this.narratives[key] = narrative;

          this.mediator.onUpdateNarrativeDefinitions.next(this.narratives);
          break;
        }
      }
    });
  }

  add() {
    this.narratives.unshift(this.builder.build());
    this.mediator.onUpdateNarrativeDefinitions.next(this.narratives);
  }

  delete(i: number) {
    this.narratives.splice(i, 1);
    this.mediator.onUpdateNarrativeDefinitions.next(this.narratives);
  }

  tryOnStart() {
    this.service.onStart(this.narratives);
  }

  tryOnEnd() {
    this.service.onEnd(this.narratives);
  }
}
