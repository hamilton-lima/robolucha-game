import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelCode, ModelGameComponent, ModelSceneComponent } from 'src/app/sdk';
import { GameDefinitionEditMediatorService, ModelGameComponentEditWrapper, ModelSceneComponentEditWrapper } from '../../game-definition-edit-mediator.service';

@Component({
  selector: 'app-single-scene-component-editor',
  templateUrl: './single-scene-component-editor.component.html',
  styleUrls: ['./single-scene-component-editor.component.scss']
})
export class SingleSceneComponentEditorComponent implements OnInit {

  id: number;
  component: ModelSceneComponent;

  form = this.formBuilder.group({
    type: ["", Validators.required],
    color: ["", Validators.required],
    x: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
    y: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
    width: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
    height: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
    alpha: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
    blockMovement: [false],
    colider: [false],
    life: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
    respawn: [false],
    rotation: [0, [Validators.required, Validators.min(0), Validators.max(360)]],
    showInRadar: [false],
  });

  helpFile: string;
  editors: { event: string; label: string; }[];
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

    this.helpFile = "help/code_editor_help";
    this.editors = [
      { event: "onRepeat", label: "On repeat" },
      { event: "onStart", label: "On start" },
      { event: "onHitWall", label: "On hit wall" },
      { event: "onFound", label: "On found" },
      { event: "onGotDamage", label: "On got damage" },
      { event: "onHitOther", label: "On hit other" },
    ];

  }

  save() {
    if (this.form.valid) {
      const component = <ModelSceneComponent>{
        type: this.form.get("type").value,
        color: this.form.get("color").value,
        x: this.form.get("x").value,
        y: this.form.get("y").value,
        width: this.form.get("width").value,
        height: this.form.get("height").value,
        alpha: this.form.get("alpha").value,
        blockMovement: this.form.get("blockMovement").value,
        colider: this.form.get("colider").value,
        life: this.form.get("life").value,
        respawn: this.form.get("respawn").value,
        rotation: this.form.get("rotation").value,
        showInRadar: this.form.get("showInRadar").value,
        codes: this.codes
      };

      const value = <ModelSceneComponentEditWrapper>{
        id: this.id,
        component: component,
      };
      this.mediator.onUpdateSceneComponent.next(value);
    }
  }

  updateCode(codes: ModelCode[]){
    this.codes = codes;
    this.save();
  }

}
