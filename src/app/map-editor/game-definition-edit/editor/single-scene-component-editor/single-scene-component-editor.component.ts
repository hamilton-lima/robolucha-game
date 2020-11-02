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
    x: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    y: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    width: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    height: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
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
      const component = <ModelGameComponent>{
        type: this.form.get("type").value,
        color: this.form.get("color").value,
        x: Number.parseInt(this.form.get("x").value),
        y: Number.parseInt(this.form.get("y").value),
        width: Number.parseInt(this.form.get("width").value),
        height: Number.parseInt(this.form.get("height").value),
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
