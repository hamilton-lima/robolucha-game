import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { DefaultService, ModelCode, ModelGameDefinition } from "src/app/sdk";
import { ModelLuchador } from "src/app/sdk/model/mainLuchador";
import { EventsService } from "src/app/shared/events.service";
import { GameDefinitionEditMediatorService } from "./game-definition-edit-mediator.service";
import { CurrentEditorEnum } from "./game-definition-edit.model";

@Component({
  selector: "app-game-definition-edit",
  templateUrl: "./game-definition-edit.component.html",
  styleUrls: ["./game-definition-edit.component.scss"],
})
export class GameDefinitionEditComponent implements OnInit {
  page: string;
  luchador: ModelLuchador;
  gameDefinitionID: number;
  gameDefinition: ModelGameDefinition;
  @ViewChild('drawer') editorDrawer: MatDrawer;

  // TODO: Remove this
  codes: ModelCode[] = [];
  currentEditor: CurrentEditorEnum;

  constructor(
    private route: ActivatedRoute,
    private api: DefaultService,
    private mediator: GameDefinitionEditMediatorService,
    private events: EventsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mediator.onEditBasicInfo.subscribe((current) => {
      this.currentEditor = CurrentEditorEnum.BasicInfo;
      this.editorDrawer.open();
    });

    this.mediator.onEditGameDefinitionCode.subscribe((current) => {
      this.currentEditor = CurrentEditorEnum.Codes;
      this.editorDrawer.open();
    });

    this.mediator.onEditSceneComponent.subscribe((current) => {
      this.currentEditor = CurrentEditorEnum.SingleSceneComponent;
      this.editorDrawer.open();
    });

    this.page = this.route.snapshot.url.join("/");
    this.luchador = this.route.snapshot.data.luchador;
    this.gameDefinitionID = Number.parseInt(
      this.route.snapshot.paramMap.get("id")
    );

    this.api
      .privateGameDefinitionIdIdGet(this.gameDefinitionID)
      .subscribe((gameDefinition) => {
        this.gameDefinition = gameDefinition;
      });
  }

  goHome(){
    this.events.click(this.page, "home");
    this.router.navigate(["home"]);
  }

  isBasicInfoCurrent(){
    return this.currentEditor == CurrentEditorEnum.BasicInfo;
  }

  isGameDefinitionCodeCurrent(){
    return this.currentEditor == CurrentEditorEnum.Codes;
  }

  isSingleSceneComponentCurrent(){
    return this.currentEditor == CurrentEditorEnum.SingleSceneComponent;
  }

}
