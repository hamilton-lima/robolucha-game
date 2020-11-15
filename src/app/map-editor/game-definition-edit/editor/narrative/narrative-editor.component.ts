import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelNarrativeDefinition } from 'src/app/sdk';
import { GameDefinitionEditMediatorService } from '../../game-definition-edit-mediator.service';

@Component({
  selector: 'app-narrative-editor',
  templateUrl: './narrative-editor.component.html',
  styleUrls: ['./narrative-editor.component.scss']
})
export class NarrativeEditorComponent implements OnInit {

  id: number;
  narrative: ModelNarrativeDefinition;

  form = this.formBuilder.group({
    event: ["", Validators.required],
    type: ["", Validators.required],
    text: [""],
    sortOrder: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
  });

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.mediator.onEditNarrative.subscribe(
      (narrative: ModelNarrativeDefinition) => {
        console.log('narrative edit', narrative);
        this.id = narrative.id;
        this.narrative = narrative;
        this.form.patchValue(this.narrative);
      }
    );

    this.form.valueChanges.subscribe(() => {
      this.save();
    });
  }

  // missing mediaID?: string;

  save() {
    if (this.form.valid) {
      const component = <ModelNarrativeDefinition>{
        id: this.narrative.id,
        event: this.form.get("event").value,
        type: this.form.get("type").value,
        text: this.form.get("text").value,
        sortOrder: this.form.get("sortOrder").value
      };

      this.mediator.onUpdateGameComponent.next(component);
    }
  }

}
