import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelGameComponent } from 'src/app/sdk';
import { GameDefinitionEditMediatorService } from '../../game-definition-edit-mediator.service';

@Component({
  selector: 'app-game-component-editor',
  templateUrl: './game-component-editor.component.html',
  styleUrls: ['./game-component-editor.component.scss']
})
export class GameComponentEditorComponent implements OnInit {

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
    this.mediator.onEditGameComponent.subscribe((component) => {
      this.component = component;
      this.form.patchValue(component);
    });

    this.form.valueChanges.subscribe(() => {
        this.save();
    });
  }

  save() {
    if (this.form.valid) {
      this.mediator.onUpdateBasicInfo.next(
        this.form.value as ModelGameComponent
      );
    }
  }


}
