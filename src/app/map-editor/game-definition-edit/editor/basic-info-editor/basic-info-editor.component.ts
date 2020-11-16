import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ModelGameDefinition } from "src/app/sdk";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";
import {
  CurrentEditorEnum,
  PartialModelGameDefinition,
} from "../../game-definition-edit.model";

@Component({
  selector: "app-basic-info-editor",
  templateUrl: "./basic-info-editor.component.html",
  styleUrls: ["./basic-info-editor.component.scss"],
})
export class BasicInfoEditorComponent implements OnInit {
  gameDefinition: ModelGameDefinition;

  form = this.formBuilder.group({
    name: ["", Validators.required],
    label: ["", Validators.required],
    description: [""],
    duration: [""],
    arenaWidth: ["", { updateOn: "blur" }],
    arenaHeight: ["", { updateOn: "blur" }],
    minParticipants: [""],
    maxParticipants: [""],
  });

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.mediator.onEditBasicInfo.subscribe((gameDefinition) => {
      this.gameDefinition = gameDefinition;
      this.form.patchValue(gameDefinition);
    });

    this.form.valueChanges.subscribe(() => {
      this.save();
    });
  }

  save() {
    if (this.form.valid) {
      this.mediator.onUpdateBasicInfo.next(
        this.form.value as PartialModelGameDefinition
      );
    }
  }
}
