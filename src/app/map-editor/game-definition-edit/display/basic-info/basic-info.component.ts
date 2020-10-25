import { Component, OnInit } from "@angular/core";
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { CurrentEditorEnum } from "src/app/map-editor/game-definition-edit/game-definition-edit.model";

@Component({
  selector: "app-basic-info",
  templateUrl: "./basic-info.component.html",
  styleUrls: ["./basic-info.component.scss"],
})
export class BasicInfoComponent implements OnInit {
  constructor(private mediator: GameDefinitionEditMediatorService) {}
  ngOnInit() {}

  edit(){
    this.mediator.onEdit.next(CurrentEditorEnum.BasicInfo);
  }
}
