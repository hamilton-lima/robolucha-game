import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Behavior } from "babylonjs";
import { BehaviorSubject } from "rxjs";
import { MaskEditorMediator, IMediatorData, FeatureChange } from "./mask-editor.mediator";
import { CanComponentDeactivate } from "src/app/can-deactivate-guard.service";
import { ModelGameComponent, DefaultService, ModelConfig } from "src/app/sdk";
import { AlertService } from "../alert.service";
import Shepherd from "shepherd.js";
import { ShepherdNewService, ITourStep } from "src/app/shepherd-new.service";
import { EventsService } from "src/app/shared/events.service";
import { UserService } from "src/app/shared/user.service";
import { FormControl, Validators } from "@angular/forms";
import { CubeGeneratorService } from "./cube.generator.service";

const HIDE_SUCCESS_TIMEOUT = 3000;

@Component({
  selector: "app-mask-editor",
  templateUrl: "./mask-editor.component.html",
  styleUrls: ["./mask-editor.component.css"]
})
export class MaskEditorComponent implements OnInit, CanComponentDeactivate {
  successMessage: string;
  dirty = false;
  luchador: ModelGameComponent;
  tour: Shepherd.Tour;
  page: string;
  errors: string[] = [];

  luchadorNameFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private route: ActivatedRoute,
    private api: DefaultService,
    private cdRef: ChangeDetectorRef,
    private mediator: MaskEditorMediator,
    private alert: AlertService,
    private shepherd: ShepherdNewService,
    private events: EventsService,
    private userService: UserService,
    private cube: CubeGeneratorService
  ) {
    this.luchador = {};
  }

  ngOnInit() {
    this.page = this.route.snapshot.url.join("/");

    const data = this.route.snapshot.data;
    // console.log('configs on maskeditor', data.luchador.configs);
    this.refreshEditor(data.luchador.configs);
    this.luchador = data.luchador;
    this.luchadorNameFormControl.setValue( this.luchador.name );

    // reset the errors when the form control is changed
    this.luchadorNameFormControl.valueChanges.subscribe(()=>{
      this.errors = [];
    });
  }

  readonly steps: ITourStep[] = [
    {
      title: "I am feeling lucky",
      text: "Click here to generate a random appearance of your luchador",
      attachTo: { element: "#random-mask", on: "left" }
    },
    {
      title: "Select what part of the mask to change",
      text: "Click here to make it yours!",
      attachTo: { element: "#mask-editor-categories-selector", on: "right" }
    }
  ];

  ngAfterViewInit() {
    const user = this.userService.getUser();

    if (!user.settings.visitedMaskPage) {
      user.settings.visitedMaskPage = true;
      this.userService.updateSettings(user.settings);
      this.tour = this.shepherd.show(this.steps);
    }
  }

  refreshEditor(configs: ModelConfig[]) {
    // console.log("refresh luchador", configs);
    this.mediator.configs.next(configs);
    this.dirty = false;
  }

  random() {
    this.events.click(this.page, "random");

    this.api.privateMaskRandomGet().subscribe(configs => {
      this.luchador.configs = configs;
      this.refreshEditor(this.luchador.configs);
      this.dirty = true;
      this.cdRef.detectChanges();
    });
  }

  save() {
    this.events.click(this.page, "save");

    this.mediator.featuresChanges = FeatureChange.Default;
    let configs = this.mediator.configs.value;
    if (configs.length > 0) {
      this.luchador.configs = configs;
      const remoteCall = this.api.privateLuchadorPut(this.luchador);

      remoteCall.subscribe(response => {
        this.alert.info("Luchador updated", "DISMISS");
        this.refreshEditor(response.luchador.configs);
        this.cdRef.detectChanges();
      });
    }
  }

  onUpdate(mediatorData : IMediatorData) {
    this.dirty = true;
    // console.log("update on luchador", configs );
    this.mediator.featuresChanges = mediatorData.featuresChanges;
    this.mediator.configs.next(mediatorData.configs);
  }

  canDeactivate() {
    if (this.dirty) {
      this.events.click(this.page, "try-to-leave-without-save");

      return window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
    }
    return true;
  }

  onNameChange(name:string){
    name = this.sanitize(name);
    console.log(name);
  }

  // see: https://github.com/fazlulkarimweb/string-sanitizer/blob/master/index.js
  sanitize(str:string){
    var str2 = str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
    return str2.replace(/ /g, " ");
  }

  saveLuchadorName(){
    console.log("save", this.luchadorNameFormControl.value);
    const value = this.sanitize(this.luchadorNameFormControl.value);
    this.luchadorNameFormControl.setValue(value);

    if (this.luchadorNameFormControl.valid) {
      this.errors = [];
      this.luchador.name = this.luchadorNameFormControl.value;
      const remoteCall = this.api.privateLuchadorPut(this.luchador);

      remoteCall.subscribe(response => {
        if( response.errors.length > 0 ){
          this.errors = response.errors;
          this.cdRef.detectChanges();
          this.alert.error("ERROR When updating Luchador Name", "DISMISS");
        } else {
          this.alert.info("Luchador NAME updated", "DISMISS");
          this.cdRef.detectChanges();
        }
      });
    }
  }

  cubeIt() {
    this.cube.generate(this.luchador.name);
  }
}
