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
  editingName: boolean;
  editedName: string;
  successMessage: string;
  addingEdit: boolean;


  constructor(
    private route: ActivatedRoute, 
    private api: DefaultService, 
    private cdRef: ChangeDetectorRef) {
    this.luchador = {};
  }

  ngOnInit() {
    const data = this.route.snapshot.data;
    this.editingName = false;
    this.renameErrorMessage = "";
    
    this.editedName = this.luchador.name;
  }

    public ngAfterViewChecked(): void {
      // if (this.addingEdit) {
      //   // console.log(this.titleEdit);
      //   this.titleEdit.nativeElement.focus();
      // }
      // this.addingEdit = false;
  
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
