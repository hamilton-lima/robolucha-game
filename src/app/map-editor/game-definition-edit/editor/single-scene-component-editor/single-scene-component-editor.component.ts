import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import {
  ModelCode,
  ModelSceneComponent,
} from "src/app/sdk";
import {
  GameDefinitionEditMediatorService,
  ModelSceneComponentEditWrapper,
} from "../../game-definition-edit-mediator.service";

@Component({
  selector: "app-single-scene-component-editor",
  templateUrl: "./single-scene-component-editor.component.html",
  styleUrls: ["./single-scene-component-editor.component.scss"],
})
export class SingleSceneComponentEditorComponent implements OnInit {
  id: number;
  component: ModelSceneComponent;

  form = this.formBuilder.group({
    type: ["", Validators.required],
    color: ["", Validators.required],
    x: [0, Validators.required],
    y: [0, Validators.required],
    width: [0, Validators.required],
    height: [0, Validators.required],
    alpha: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
    blockMovement: [false],
    colider: [false],
    life: [0, Validators.required],
    rotation: [0, Validators.required],
    respawn: [false],
    showInRadar: [false],
  });

  helpFile: string = "help/code_editor_help";
  editors: { event: string; label: string }[] = [
    { event: "onRepeat", label: "On repeat" },
    { event: "onStart", label: "On start" },
    { event: "onHitWall", label: "On hit wall" },
    { event: "onFound", label: "On found" },
    { event: "onGotDamage", label: "On got damage" },
    { event: "onHitOther", label: "On hit other" },
  ];

  codes: ModelCode[];

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.mediator.onEditSceneComponent.subscribe(
      (wrapper: ModelSceneComponentEditWrapper) => {
        this.id = wrapper.id;
        this.component = wrapper.component;
        this.codes = this.component.codes;
        this.form.patchValue(this.component);
      }
    );

    this.form.valueChanges.subscribe(() => {
      this.save();
    });
  }

  save() {
    if (this.form.valid) {
      const component = <ModelSceneComponent>{
        id: this.component.id,
        type: this.form.get("type").value,
        color: this.form.get("color").value,
        x: Number.parseInt(this.form.get("x").value),
        y: Number.parseInt(this.form.get("y").value),
        width: Number.parseInt(this.form.get("width").value),
        height: Number.parseInt(this.form.get("height").value),
        alpha: Number.parseFloat(this.form.get("alpha").value),
        blockMovement: this.form.get("blockMovement").value,
        colider: this.form.get("colider").value,
        life: Number.parseInt(this.form.get("life").value),
        rotation: Number.parseInt(this.form.get("rotation").value),
        respawn: this.form.get("respawn").value,
        showInRadar: this.form.get("showInRadar").value,
        codes: this.codes,
      };

      const value = <ModelSceneComponentEditWrapper>{
        id: this.id,
        component: component,
      };
      this.mediator.onUpdateSceneComponent.next(value);
    }
  }

  updateCode(codes: ModelCode[]) {
    this.codes = codes;
    this.save();
  }
}
