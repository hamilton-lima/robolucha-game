import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { ArenaComponent } from "src/app/arena/arena.component";
import { DefaultService, ModelCode, ModelGameDefinition } from "src/app/sdk";
import { ModelLuchador } from "src/app/sdk/model/mainLuchador";
import { AlertService } from "src/app/shared/alert.service";
import { EventsService } from "src/app/shared/events.service";
import { GameDefinitionEditMediatorService } from "./game-definition-edit-mediator.service";
import { CurrentEditorEnum, PartialModelGameDefinition } from "./game-definition-edit.model";

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
  dirty = false;

  @ViewChild("drawer") editorDrawer: MatDrawer;
  @ViewChild("arena") arena: ArenaComponent;
  
  // TODO: Remove this
  codes: ModelCode[] = [];
  currentEditor: CurrentEditorEnum;
  readonly fieldsRequireMapRefresh = ["arenaWidth", "arenaHeight"];

  constructor(
    private route: ActivatedRoute,
    private api: DefaultService,
    private mediator: GameDefinitionEditMediatorService,
    private events: EventsService,
    private router: Router,
    private alert: AlertService
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

    this.mediator.onSaveBasicInfo.subscribe((partial) => {
      if (partial && this.gameDefinition) {
        const updatedFields = [];

        // update fields and track updated ones
        Object.keys(partial).forEach((key) => {
          if (partial.hasOwnProperty(key)) {
            if (typeof this.gameDefinition[key] === "number"){
              const value = Number.parseInt(partial[key]);
              if( value != this.gameDefinition[key] ){
                this.gameDefinition[key] = value;
                updatedFields.push(key);
              }
            } else {
              if( partial[key] != this.gameDefinition[key] ){
                this.gameDefinition[key] = partial[key];
                updatedFields.push(key);
              }
            }
          }
        });

        if( updatedFields.length > 0 ){
          this.dirty = true;
        }

        updatedFields.forEach( field => {
          const found = this.fieldsRequireMapRefresh.find( inner => inner == field);
          if( found ){
            this.refreshArenaPreview();
          }
        });
      }
    });

    this.page = this.route.snapshot.url.join("/");
    this.luchador = this.route.snapshot.data.luchador;
    this.gameDefinitionID = Number.parseInt(
      this.route.snapshot.paramMap.get("id")
    );

    this.api
      .privateGameDefinitionIdIdGet(this.gameDefinitionID)
      .subscribe((gameDefinition) => {
        this.dirty = false;
        this.gameDefinition = gameDefinition;
      });
  }

  refreshArenaPreview(){
    if( this.gameDefinition){
      this.arena.dispose();
      this.arena.createScene();
    }
  }

  save() {
    this.api.privateMapeditorPut(this.gameDefinition).subscribe((result) => {
      this.alert.infoTop("Map updated", "DISMISS");
      this.dirty = false;
    });
  }

  goAllMaps() {
    this.events.click(this.page, "all-maps");
    this.router.navigate(["maps"]);
  }

  isBasicInfoCurrent() {
    return this.currentEditor == CurrentEditorEnum.BasicInfo;
  }

  isGameDefinitionCodeCurrent() {
    return this.currentEditor == CurrentEditorEnum.Codes;
  }

  isSingleSceneComponentCurrent() {
    return this.currentEditor == CurrentEditorEnum.SingleSceneComponent;
  }
}
