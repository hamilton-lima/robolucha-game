import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { ArenaComponent, Pickable } from "src/app/arena/arena.component";
import { DefaultService, ModelCode, ModelGameDefinition } from "src/app/sdk";
import { ModelLuchador } from "src/app/sdk/model/mainLuchador";
import { AlertService } from "src/app/shared/alert.service";
import { EventsService } from "src/app/shared/events.service";
import { MatchState } from "src/app/watch-match/watch-match.model";
import { GameComponentBuildService } from "./display/game-component/game-component-build.service";
import {
  GameDefinitionEditMediatorService,
  ModelGameComponentEditWrapper,
} from "./game-definition-edit-mediator.service";
import { CurrentEditorEnum } from "./game-definition-edit.model";
import { MatchStateBuilderService } from "./match-state-builder.service";

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
  matchState = new EventEmitter<MatchState>();

  currentEditor: CurrentEditorEnum;
  readonly fieldsRequireMapRefresh = ["arenaWidth", "arenaHeight"];

  constructor(
    private route: ActivatedRoute,
    private api: DefaultService,
    private mediator: GameDefinitionEditMediatorService,
    private events: EventsService,
    private router: Router,
    private alert: AlertService,
    private builder: MatchStateBuilderService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.mediator.onEditBasicInfo.subscribe((current) => {
      if (current && this.editorDrawer) {
        this.currentEditor = CurrentEditorEnum.BasicInfo;
        this.editorDrawer.open();
      }
    });

    this.mediator.onEditGameDefinitionCode.subscribe((current) => {
      if (current && this.editorDrawer) {
        this.currentEditor = CurrentEditorEnum.Codes;
        this.editorDrawer.open();
      }
    });

    this.mediator.onEditSceneComponent.subscribe((current) => {
      if (current && this.editorDrawer) {
        this.currentEditor = CurrentEditorEnum.SingleSceneComponent;
        this.editorDrawer.open();
      }
    });

    this.mediator.onEditGameDefinitionSuggestedCode.subscribe((current) => {
      if (current && this.editorDrawer) {
        this.currentEditor = CurrentEditorEnum.SuggestedCode;
        this.editorDrawer.open();
      }
    });

    this.mediator.onEditGameComponent.subscribe((current) => {
      if (current && this.editorDrawer) {
        this.currentEditor = CurrentEditorEnum.GameComponent;
        this.editorDrawer.open();
      }
    });

    this.mediator.onUpdateBasicInfo.subscribe((partial) => {
      if (partial && this.gameDefinition) {
        this.updateBasicInfo(partial);
      }
    });

    this.mediator.onUpdateSceneComponents.subscribe((components) => {
      console.log("updated", components);
      this.gameDefinition.sceneComponents = components;
      this.refreshMatchState();
      this.dirty = true;
    });

    this.mediator.onUpdateGameDefinitionCode.subscribe((codes) => {
      console.log("code updated", codes);
      this.gameDefinition.codes = codes;
      this.dirty = true;
    });

    this.mediator.onUpdateSuggestedCode.subscribe((codes) => {
      console.log("code updated", codes);
      this.gameDefinition.suggestedCodes = codes;
      this.dirty = true;
    });

    this.mediator.onUpdateGameComponents.subscribe((components) => {
      this.gameDefinition.gameComponents = components;
      this.refreshMatchState();
      this.dirty = true;
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

        this.cdRef.detectChanges();
        this.refreshMatchState();
      });
  }

  onArenaReady() {
    this.refreshMatchState();
  }

  updateBasicInfo(partial) {
    const updatedFields = [];

    // update fields and track updated ones
    Object.keys(partial).forEach((key) => {
      if (partial.hasOwnProperty(key)) {
        if (typeof this.gameDefinition[key] === "number") {
          const value = Number.parseInt(partial[key]);
          if (value != this.gameDefinition[key]) {
            this.gameDefinition[key] = value;
            updatedFields.push(key);
          }
        } else {
          if (partial[key] != this.gameDefinition[key]) {
            this.gameDefinition[key] = partial[key];
            updatedFields.push(key);
          }
        }
      }
    });

    console.log("after update basic info", this.gameDefinition.codes);

    if (updatedFields.length > 0) {
      this.dirty = true;
    }

    updatedFields.forEach((field) => {
      const found = this.fieldsRequireMapRefresh.find(
        (inner) => inner == field
      );
      if (found) {
        this.refreshArenaPreview();
      }
    });
  }

  refreshMatchState() {
    // force remove all scene and NPC from the arena
    this.matchState.emit(this.builder.build([], []));

    this.matchState.emit(
      this.builder.build(
        this.gameDefinition.sceneComponents,
        this.gameDefinition.gameComponents
      )
    );
  }

  refreshArenaPreview() {
    if (this.gameDefinition) {
      this.arena.dispose();
      this.arena.createScene();
      this.refreshMatchState();
    }
  }

  save() {
    console.log(
      "save gamedefinition with codes",
      this.gameDefinition.codes.length,
      this.gameDefinition.codes
    );

    const body = this.removeTemporaryIDs();

    this.api.privateMapeditorPut(body).subscribe((result) => {
      this.alert.infoTop("Map updated", "DISMISS");
      this.dirty = false;
    });
  }

  removeTemporaryIDs() {
    // clone
    const result: ModelGameDefinition = Object.assign({}, this.gameDefinition);

    // remove temporary IDs
    result.sceneComponents = this.gameDefinition.sceneComponents.map((c) => {
      if (c.id < 0) {
        c.id = 0;
      }
      return c;
    });

    result.gameComponents = this.gameDefinition.gameComponents.map((c) => {
      if (c.id < 0) {
        c.id = 0;
      }
      return c;
    });

    return result;
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

  isGameDefinitionSuggestedCodeCurrent() {
    return this.currentEditor == CurrentEditorEnum.SuggestedCode;
  }

  isGameComponentCurrent() {
    return this.currentEditor == CurrentEditorEnum.GameComponent;
  }

  pick(target: Pickable){
    console.log('clicked on ', target );    
  }
}
