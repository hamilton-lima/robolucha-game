import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ModelNarrativeDefinition } from "src/app/sdk";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";
import { FileUploadService } from "src/app/shared/file-upload/file-upload.service";

@Component({
  selector: "app-narrative-editor",
  templateUrl: "./narrative-editor.component.html",
  styleUrls: ["./narrative-editor.component.scss"],
})
export class NarrativeEditorComponent implements OnInit {
  readonly NOTFOUND_IMAGE = "assets/maps/image-not-found.png";
  id: number;
  narrative: ModelNarrativeDefinition;
  preview = this.NOTFOUND_IMAGE;

  form = this.formBuilder.group({
    event: ["", Validators.required],
    type: ["", Validators.required],
    text: [""],
    file: [""],
    sortOrder: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
  });

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private formBuilder: FormBuilder,
    private uploader: FileUploadService
  ) {}

  ngOnInit() {
    this.mediator.onEditNarrative.subscribe(
      (narrative: ModelNarrativeDefinition) => {
        this.id = narrative.id;
        this.narrative = narrative;
        this.form.patchValue(this.narrative);
        console.log('mediaID', narrative.mediaID);

        if( narrative.mediaID ){
          this.uploader.findOne(narrative.mediaID).subscribe( response =>{
            this.preview = response.formats.thumbnail.url;
          });
        } else {
          this.preview = this.NOTFOUND_IMAGE;
        }
      }
    );

    this.form.valueChanges.subscribe(() => {
      this.save();
    });

    this.form.get("file").valueChanges.subscribe(() => {
      this.uploadImage();
    });
  }

  save() {
    if (this.form.valid) {

      const narrative = <ModelNarrativeDefinition>{
        id: this.narrative.id,
        event: this.form.get("event").value,
        type: this.form.get("type").value,
        text: this.form.get("text").value,
        mediaID: this.narrative.mediaID,
        sortOrder: this.form.get("sortOrder").value,
      };

      this.mediator.onUpdateNarrative.next(narrative);
    }
  }

  uploadImage() {
    const formData = new FormData();
    formData.append("files", this.form.get("file").value);
    const monitor = this.uploader.upload(formData);

    monitor.progress.subscribe((progress) => console.log("progress", progress));

    monitor.response.subscribe((response) => {
      console.log('response', response );
      this.preview = response.formats.thumbnail.url;
      this.narrative.mediaID = response.id.toString();
      this.save();
    });
  }
}
