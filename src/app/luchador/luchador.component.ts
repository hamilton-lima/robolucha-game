import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked} from "@angular/core";

import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DefaultService } from "../sdk/api/default.service";
import { MainLuchador } from "../sdk/model/mainLuchador";
import { MainCode } from "../sdk/model/mainCode";

import { MainUpdateLuchadorResponse } from '../sdk/model/mainUpdateLuchadorResponse';
import { ActivatedRoute } from "@angular/router";
import { debounceTime } from "rxjs/operators";

const HIDE_SUCCESS_TIMEOUT = 3000;

@Component({
  selector: "app-home",
  templateUrl: "./luchador.component.html",
  styleUrls: ["./luchador.component.css"]
})
export class LuchadorComponent implements OnInit, AfterViewChecked {
  // private titleEdit: ElementRef;
  // @ViewChild("titleEdit") set content(content: ElementRef) {
    // this.titleEdit = content;
  // }
  @ViewChild("titleEdit") titleEdit:ElementRef;  

  private nameForm: ElementRef;
  @ViewChild("nameForm" ) set formContent(content: ElementRef) {
    this.nameForm = content;
  }

  luchador: MainLuchador;
  luchadorResponse: MainUpdateLuchadorResponse;
  renameErrorMessage: string;
  displayErrorMessage: boolean;
  dirty: boolean;
  editingName: boolean;
  editedName: string;
  successMessage: string;
  addingEdit: boolean;

  codes = {
    onStart: <MainCode>{},
    onRepeat: <MainCode>{},
    onGotDamage: <MainCode>{},
    onFound: <MainCode>{},
    onHitOther: <MainCode>{},
    onHitWall: <MainCode>{}
  };

  constructor(
    private route: ActivatedRoute, 
    private api: DefaultService, 
    private cdRef: ChangeDetectorRef) {
    this.luchador = {};
  }

  ngOnInit() {
    const data = this.route.snapshot.data;
    this.dirty = false;
    this.editingName = false;
    this.renameErrorMessage = "";
    
    this.refreshEditor(data.luchador);
    this.editedName = this.luchador.name;
  }

    public ngAfterViewChecked(): void {
      // if (this.addingEdit) {
      //   // console.log(this.titleEdit);
      //   this.titleEdit.nativeElement.focus();
      // }
      // this.addingEdit = false;
  
  }

  canDeactivate() {
    if (this.dirty) {
      return window.confirm("You have unsaved changes to your luchador code. Are you sure you want to leave?");
    }
    return true;
  }

  refreshEditor(luchador) {
    console.log("refresh luchador", luchador);
    this.luchador = luchador;
    for (var key in this.codes) {
      this.codes[key] = this.getCode(key);
    }
  }

  getCode(event: string): MainCode {
    let result = this.findCodeByEventName(event);

    if (!result) {
      result = <MainCode>{};
    }

    return result;
  }

  findCodeByEventName(event: string) {
    return this.luchador.codes.find((code: MainCode) => {
      if (code.event == event) {
        return true;
      }
      return false;
    });
  }

  updateCode(event: string, script: string) {
    console.log("updateCode", event, script);
    this.dirty = true;

    let code = this.findCodeByEventName(event);

    if (code) {
      code.script = script;
    } else {
      code = <MainCode>{ event: event, script: script };
      this.luchador.codes.push(code);
    }

    this.codes[event] = code;
  }

  save() {
    const remoteCall = this.api.privateLuchadorPut(this.luchador);

    remoteCall.subscribe(response => {
      this.successMessage = "Luchador updated";
      this.dirty = false;
      setTimeout(() => this.successMessage = null, HIDE_SUCCESS_TIMEOUT);

      this.refreshEditor(response.luchador);
      this.cdRef.detectChanges();    
    });
  }

  editName() {
    this.editingName = true;
    this.addingEdit = true;
    //this.editField.nativeElement.focus();
  }

  nameInputChanged() {
    this.displayErrorMessage = false;
  }

  saveName() {
    this.luchador.name = this.editedName;
    const remoteCall = this.api.privateLuchadorPut(this.luchador);
    
    remoteCall.subscribe( response => {
      if (response.errors == null || response.errors.length == 0) {
        this.displayErrorMessage = false;
        this.successMessage = "Luchador name updated";
        this.editingName = false;
        setTimeout(() => this.successMessage = null, HIDE_SUCCESS_TIMEOUT);
      }
      else {
        this.displayErrorMessage = true;
        this.renameErrorMessage = response.errors.join(', ');
      }

    });

  }
}
