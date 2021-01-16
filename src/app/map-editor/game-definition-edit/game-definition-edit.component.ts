import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  Output,
} from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { ArenaComponent, Pickable } from "src/app/arena/arena.component";
import {
  DefaultService,
  ModelCode,
  ModelGameDefinition,
  ModelMediaRequest,
} from "src/app/sdk";
import { ModelLuchador } from "src/app/sdk/model/mainLuchador";
import { AlertService } from "src/app/shared/alert.service";
import { EventsService } from "src/app/shared/events.service";
import { FileUploadService } from "src/app/shared/file-upload/file-upload.service";
import { MatchState } from "src/app/watch-match/watch-match.model";
import { MapEditorService } from "../map-editor.service";
import { GameDefinitionEditMediatorService } from "./game-definition-edit-mediator.service";
import { CurrentEditorEnum } from "./game-definition-edit.model";
import { MatchStateBuilderService } from "./match-state-builder.service";
import * as moment from "moment";

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

  @Output() onPickElement = new EventEmitter<Pickable>();

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
    private cdRef: ChangeDetectorRef,
    private uploader: FileUploadService,
    private service: MapEditorService
  ) {}

  refreshEditorDrawer(nextEditor: CurrentEditorEnum) {
    if (this.currentEditor == nextEditor) {
      this.currentEditor = nextEditor;
      this.editorDrawer.toggle();
    } else {
      this.currentEditor = nextEditor;
      this.editorDrawer.open();
    }
  }

  ngOnInit() {
    this.service.init();

    this.mediator.onEditBasicInfo.subscribe((current) => {
      if (current && this.editorDrawer) {
        this.refreshEditorDrawer(CurrentEditorEnum.BasicInfo);
      }
    });

    this.mediator.onEditSceneComponent.subscribe((current) => {
      if (current && this.editorDrawer) {
        this.refreshEditorDrawer(CurrentEditorEnum.SingleSceneComponent);
      }
    });

    this.mediator.onEditGameDefinitionSuggestedCode.subscribe((current) => {
      if (current && this.editorDrawer) {
        this.refreshEditorDrawer(CurrentEditorEnum.SuggestedCode);
      }
    });

    this.mediator.onEditGameComponent.subscribe((current) => {
      if (current && this.editorDrawer) {
        this.refreshEditorDrawer(CurrentEditorEnum.GameComponent);
      }
    });

    this.mediator.onEditNarrative.subscribe((current) => {
      if (current && this.editorDrawer) {
        this.refreshEditorDrawer(CurrentEditorEnum.Narrative);
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

    this.mediator.onUpdateNarrativeDefinitions.subscribe((narratives) => {
      this.gameDefinition.narrativeDefinitions = narratives;
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
    const body = this.removeTemporaryIDs();

    this.api.privateMapeditorPut(body).subscribe((result) => {
      this.alert.infoTop("Map updated", "CLOSE");
      this.dirty = false;
    });
  }

  removeTemporaryIDs() {
    // clone
    const result: ModelGameDefinition = Object.assign({}, this.gameDefinition);

    const removeID = function (c: any) {
      if (c.id < 0) {
        c.id = 0;
      }
      return c;
    };

    // remove temporary IDs
    result.sceneComponents = this.gameDefinition.sceneComponents.map(removeID);
    result.gameComponents = this.gameDefinition.gameComponents.map(removeID);
    result.narrativeDefinitions = this.gameDefinition.narrativeDefinitions.map(
      removeID
    );

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

  isNarrativeCurrent() {
    return this.currentEditor == CurrentEditorEnum.Narrative;
  }

  pick(target: Pickable) {
    this.onPickElement.emit(<Pickable>{
      id: target.id,
      name: target.name,
      point: target.point,
      event: target.event,
    });
  }

  screenshot() {
    console.log("ask screenshot");
    const subject = this.arena.getScreenShot((data) => {
      console.log("screenshot data");

      const request = <ModelMediaRequest>{
        base64Data: data,
        fileName: "screenshot.png",
      };
      this.uploader.upload(request).subscribe((media) => {
        this.gameDefinition.media = media;
        console.log("media", media);
        this.dirty = true;
      });
    });
  }

  canDeactivate() {
    if (this.dirty) {
      return window.confirm(
        "You have unsaved changes to your map. Are you sure you want to leave?"
      );
    }
    return true;
  }

  download() {
    const json = JSON.stringify(this.gameDefinition);
    const encoded = encodeURIComponent(json);
    const element = document.createElement("a");
    const now = moment().format();
    const name =
      "gamedefinition-" + this.gameDefinition.id + "-" + now + ".json";

    element.setAttribute("href", "data:text/json;charset=UTF-8," + encoded);
    element.setAttribute("download", name);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click(); 
    document.body.removeChild(element);
  }
}
