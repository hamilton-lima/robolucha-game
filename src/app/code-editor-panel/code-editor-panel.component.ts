import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  Output
} from "@angular/core";
import { ModelCode } from "../sdk/model/mainCode";

import { ModelUpdateLuchadorResponse } from "../sdk/model/mainUpdateLuchadorResponse";
import { ActivatedRoute } from "@angular/router";

import { DefaultService } from "../sdk/api/default.service";
import { ModelLuchador } from "../sdk/model/mainLuchador";
import { ModelGameDefinition } from "../sdk";
import { EventsService } from "../shared/events.service";
import { AlertService } from "../pages/alert.service";


@Component({
  selector: "app-code-editor-panel",
  templateUrl: "./code-editor-panel.component.html",
  styleUrls: ["./code-editor-panel.component.css"]
})
export class CodeEditorPanelComponent implements OnInit, OnChanges {
  dirty: boolean = false;
  luchador: ModelLuchador;
  luchadorResponse: ModelUpdateLuchadorResponse;
  successMessage: string;
  page:string;

  @Input() gameDefinition: ModelGameDefinition;
  @Output() onSave = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute,
    private api: DefaultService,
    private cdRef: ChangeDetectorRef,
    private events: EventsService,
    private alert: AlertService
  ) {
    const data = this.route.snapshot.data;
    this.page = this.route.snapshot.url.join("/");

    this.luchador = data.luchador;
  }

  codes = {
    onStart: <ModelCode>{ event: "onStart" },
    onRepeat: <ModelCode>{ event: "onRepeat" },
    onGotDamage: <ModelCode>{ event: "onGotDamage" },
    onFound: <ModelCode>{ event: "onFound" },
    onHitOther: <ModelCode>{ event: "onHitOther" },
    onHitWall: <ModelCode>{ event: "onHitWall" }
  };

  ngOnInit() {
    const data = this.route.snapshot.data;
    this.luchador = data.luchador;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refreshEditor();
    this.cdRef.detectChanges();
  }

  /** Loads codes from luchador to the editor, filter by gameDefinition */
  refreshEditor() {
    if( !  this.gameDefinition){
      console.warn("gameDefinition not set in code-editor-panel");
      return;
    }
    
    let loadedCodes = 0;
    this.dirty = false;

    for (var event in this.codes) {
      // get codes from luchador for event + gamedefinition
      let code = this.luchador.codes.find((code: ModelCode) => {
        return (
          code.event == event && code.gameDefinition == this.gameDefinition.id
        );
      });

      // if exists updates working codes
      if (code) {
        loadedCodes++;
        this.codes[event] = code;
      }
    }

    // no code found for current gamedefinition
    // apply suggested codes
    if (loadedCodes == 0) {
      for (var key in this.codes) {
        let suggestedCode = this.getCodeFromGameDefinition(key);
        this.codes[key] = suggestedCode;
      }

      this.dirty = true;
    }
  }

  // return suggested code from the current gamedefinition
  // if event not present in the list returns empy code
  getCodeFromGameDefinition(event: string): ModelCode {
    let result: ModelCode = this.gameDefinition.suggestedCodes.find(element => {
      return element.event == event;
    });

    if (!result) {
      result = <ModelCode>{ event: event };
    }

    result.id = null;
    result.gameDefinition = this.gameDefinition.id;
    return result;
  }

  // update the internal list of codes from the editor 
  updateCode(event: string, script: string) {
    // console.log("update code", event, script);
    this.dirty = true;
    this.codes[event].script = script;
  }

  save() {
    // apply the changes to the luchador object
    for (var event in this.codes) {
      // get codes from luchador for event + gamedefinition
      let code = this.luchador.codes.find((code: ModelCode) => {
        return (
          code.event == event &&
          code.gameDefinition == this.codes[event].gameDefinition
        );
      });

      // if exists updates the luchador with working code
      if (code) {
        code.script = this.codes[event].script;
      } else {
        this.luchador.codes.push(this.codes[event]);
      }
    }

    this.api.privateLuchadorPut(this.luchador).subscribe(response => {
      this.alert.infoTop("Luchador updated","DISMISS")
      this.dirty = false;
      this.cdRef.detectChanges();
      this.onSave.emit();
    });
  }
}
