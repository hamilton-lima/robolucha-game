import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ModelCode, ModelSceneComponent } from "src/app/sdk";
import { BlocklyConfig } from "src/app/shared/code-blockly/code-blockly.service";
import { CodeEditorEvent } from "src/app/shared/code-editor/code-editor.component";
import { CodeEditorService } from "src/app/shared/code-editor/code-editor.service";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";

@Component({
  selector: "app-single-scene-component-editor",
  templateUrl: "./single-scene-component-editor.component.html",
  styleUrls: ["./single-scene-component-editor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSceneComponentEditorComponent implements OnInit {
  @Input() gameDefinitionID;

  id: number;
  component: ModelSceneComponent;

  form = this.formBuilder.group({
    type: ["", Validators.required],
    color: ["", Validators.required],
    x: [0, Validators.required],
    y: [0, Validators.required],
    z: [0, Validators.required],
    width: [0, Validators.required],
    height: [0, Validators.required],
    length: [0, Validators.required],
    alpha: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
    blockMovement: [false],
    colider: [false],
    life: [0, Validators.required],
    rotation: [0, Validators.required],
    respawn: [false],
    showInRadar: [false],
  });

  code: ModelCode;
  config = BlocklyConfig.SceneComponent;

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private formBuilder: FormBuilder,
    private service: CodeEditorService,
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.mediator.onEditSceneComponent.subscribe(
      (component: ModelSceneComponent) => {
        this.id = component.id;
        this.component = component;
        this.code = this.service.getCode(this.component.codes, this.gameDefinitionID);
        this.form.patchValue(this.component);
        this.changeRef.markForCheck();
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
        z: Number.parseInt(this.form.get("z").value),
        width: Number.parseInt(this.form.get("width").value),
        height: Number.parseInt(this.form.get("height").value),
        length: Number.parseInt(this.form.get("length").value),
        alpha: Number.parseFloat(this.form.get("alpha").value),
        blockMovement: this.form.get("blockMovement").value,
        colider: this.form.get("colider").value,
        life: Number.parseInt(this.form.get("life").value),
        rotation: Number.parseInt(this.form.get("rotation").value),
        respawn: this.form.get("respawn").value,
        showInRadar: this.form.get("showInRadar").value,
        codes: [this.code],
      };

      this.mediator.onUpdateSceneComponent.next(component);
    }
  }

  updateCode(event: CodeEditorEvent) {
    this.code.blockly = event.blocklyDefinition;
    this.code.script = event.code;
    this.save();
  }
}
