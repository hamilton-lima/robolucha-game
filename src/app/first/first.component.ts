import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DefaultService, MainGameDefinition } from "../sdk";
import { NgxSpinnerService } from "ngx-spinner";
import { MainLuchador } from "../sdk/model/mainLuchador";
import { CanComponentDeactivate } from "../can-deactivate-guard.service";
import { CodeEditorPanelComponent } from "../code-editor-panel/code-editor-panel.component";

export interface Selection {
  position: number;
  total: number;
  value: number;
  label: string;
}

@Component({
  selector: "app-first",
  templateUrl: "./first.component.html",
  styleUrls: ["./first.component.css"]
})
export class FirstComponent implements OnInit, CanComponentDeactivate {
  gameDefinitions: MainGameDefinition[];
  gameDefinition: MainGameDefinition;
  selection = <Selection>{ value: 0, label: "N/A"};
  luchador: MainLuchador;
  matchID = 0;

  @ViewChild(CodeEditorPanelComponent) codeEditor: CodeEditorPanelComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: DefaultService,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    const data = this.route.snapshot.data;
    this.luchador = data.luchador;

    this.api
      .privateTutorialGet()
      .subscribe((gamedefinitions: MainGameDefinition[]) => {
        this.gameDefinitions = gamedefinitions;
        if (gamedefinitions.length > 0) {
          this.gameDefinition = gamedefinitions[0];
          this.selection.total = gamedefinitions.length;
        }
        this.updateSelection(0);
        this.spinner.hide();
      });
  }

  updateSelection(position: number) {
    if (position < 0) {
      position = 0;
    }

    if (position >= this.selection.total) {
      position = this.selection.total - 1;
    }

    this.selection.position = position;
    this.selection.value = Math.floor((position+1) / this.selection.total * 100);
    this.selection.label = position + 1 + " of " + this.selection.total;

    this.gameDefinition = this.gameDefinitions[position];
  }

  left() {
    this.updateSelection(this.selection.position - 1);
  }

  right() {
    this.updateSelection(this.selection.position + 1);
  }

  // TODO: add this when changing gamedefinition
  canDeactivate() {
    if (this.codeEditor.dirty) {
      return window.confirm(
        "You have unsaved changes to your luchador code. Are you sure you want to leave?"
      );
    }
    return true;
  }

  endMatch(){
    console.log("end match");
  }
}
