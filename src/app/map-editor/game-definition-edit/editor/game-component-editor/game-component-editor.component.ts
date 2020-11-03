import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ModelCode, ModelGameComponent } from "src/app/sdk";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";

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

  helpFile: string = "help/server_code_editor_help";
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
    this.mediator.onEditGameComponent.subscribe(
      (component: ModelGameComponent) => {
        this.id = component.id;
        this.component = component;
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
      const component = <ModelGameComponent>{
        id: this.component.id,
        name: this.form.get("name").value,
        life: Number.parseInt(this.form.get("life").value),
        angle: Number.parseInt(this.form.get("angle").value),
        gunAngle: Number.parseInt(this.form.get("gunAngle").value),
        x: Number.parseInt(this.form.get("x").value),
        y: Number.parseInt(this.form.get("y").value),
        codes: this.codes,
      };

      this.mediator.onUpdateGameComponent.next(component);
    }
  }

  updateCode(codes: ModelCode[]) {
    this.codes = codes;
    this.save();
  }
}
