import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ModelCode, ModelGameComponent } from "src/app/sdk";
import { CodeEditorEvent } from "src/app/shared/code-editor/code-editor.component";
import { CodeEditorService } from "src/app/shared/code-editor/code-editor.service";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";

@Component({
  selector: "app-game-component-editor",
  templateUrl: "./game-component-editor.component.html",
  styleUrls: ["./game-component-editor.component.scss"],
})
export class GameComponentEditorComponent implements OnInit {
  @Input() gameDefinitionID;
  
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

  code: ModelCode;

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private formBuilder: FormBuilder,
    private service: CodeEditorService,
  ) {}

  ngOnInit() {
    this.mediator.onEditGameComponent.subscribe(
      (component: ModelGameComponent) => {
        this.id = component.id;
        this.component = component;
        this.code = this.service.getCode(this.component.codes, this.gameDefinitionID);
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
        codes: [this.code],
      };

      this.mediator.onUpdateGameComponent.next(component);
    }
  }

  updateCode(event: CodeEditorEvent) {
    this.code.blockly = event.blocklyDefinition;
    this.code.script = event.code;
    this.save();
  }
}
