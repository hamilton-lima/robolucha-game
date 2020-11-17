import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ModelMediaRequest, ModelNarrativeDefinition } from "src/app/sdk";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";
import { FileUploadService } from "src/app/shared/file-upload/file-upload.service";
import { Subject } from "rxjs";

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
        console.log("mediaID", narrative.media);

        if (narrative.media) {
          this.preview = narrative.media.thumbnail;
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
      console.log('saving narrative form', this.narrative);

      const narrative = <ModelNarrativeDefinition>{
        id: this.narrative.id,
        event: this.form.get("event").value,
        type: this.form.get("type").value,
        text: this.form.get("text").value,
        media: this.narrative.media,
        sortOrder: Number.parseInt(this.form.get("sortOrder").value),
      };

      this.mediator.onUpdateNarrative.next(narrative);
    }
  }

  fileInputToBase64(file): Subject<string> {
    const result = new Subject<string>();
    const reader = new FileReader();

    reader.onloadend = function () {
      result.next(reader.result.toString());
    };

    reader.readAsDataURL(file);
    return result;
  }

  uploadImage() {
    const file: File = this.form.get("file").value;

    this.fileInputToBase64(file).subscribe(base64 =>{
      const request = <ModelMediaRequest>{
        base64Data: base64,
        fileName: file.name
      }
      this.uploader.upload(request).subscribe(media =>{
        console.log('media', media);
        this.narrative.media = media;
        this.preview = media.thumbnail;
        this.save();
      });
    });
  }
}
