import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ModelGameComponent } from "src/app/sdk";
import {
  GameDefinitionEditMediatorService,
  ModelGameComponentEditWrapper,
} from "../../game-definition-edit-mediator.service";

@Component({
  selector: "app-game-component-editor",
  templateUrl: "./game-component-editor.component.html",
  styleUrls: ["./game-component-editor.component.scss"],
})
export class GameComponentEditorComponent implements OnInit {
  id: number;
  component: ModelGameComponent;

  form = this.formBuilder.group({
    name: ["", Validators.required],
    life: ["", Validators.required],
    angle: [""],
    gunAngle: [""],
    x: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    y: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
  });

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.mediator.onEditGameComponent.subscribe(
      (wrapper: ModelGameComponentEditWrapper) => {
        this.id = wrapper.id;
        this.component = wrapper.component;
        this.form.patchValue(this.component);
      }
    );

    this.form.valueChanges.subscribe(() => {
      this.save();
    });
  }

  save() {
    if (this.form.valid) {
      const component = <ModelGameComponent>{
        name: this.form.get("name").value,
        life: Number.parseInt(this.form.get("life").value),
        angle: Number.parseInt(this.form.get("angle").value),
        gunAngle: Number.parseInt(this.form.get("gunAngle").value),
        x: Number.parseInt(this.form.get("x").value),
        y: Number.parseInt(this.form.get("y").value),
      };

      const value = <ModelGameComponentEditWrapper>{
        id: this.id,
        component: component,
      };
      this.mediator.onUpdateGameComponent.next(value);
    }
  }
}
