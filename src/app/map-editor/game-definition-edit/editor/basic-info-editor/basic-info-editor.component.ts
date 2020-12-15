import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MapEditorService } from "src/app/map-editor/map-editor.service";
import { ModelGameDefinition, ModelMediaRequest } from "src/app/sdk";
import { FileUploadService } from "src/app/shared/file-upload/file-upload.service";
import { FormUtilsService } from "src/app/shared/form-utils.service";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";
import { PartialModelGameDefinition } from "../../game-definition-edit.model";

@Component({
  selector: "app-basic-info-editor",
  templateUrl: "./basic-info-editor.component.html",
  styleUrls: ["./basic-info-editor.component.scss"],
})
export class BasicInfoEditorComponent implements OnInit {
  gameDefinition: ModelGameDefinition;
  readonly NOTFOUND_IMAGE = "assets/maps/image-not-found.png";
  preview = this.NOTFOUND_IMAGE;
  definitions: ModelGameDefinition[];

  form = this.formBuilder.group({
    name: ["", Validators.required],
    label: ["", Validators.required],
    description: [""],
    duration: [""],
    arenaWidth: ["", { updateOn: "blur" }],
    arenaHeight: ["", { updateOn: "blur" }],
    minParticipants: [""],
    maxParticipants: [""],
    nextGamedefinitionID: [""],
    file: [""],
  });

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private formBuilder: FormBuilder,
    private uploader: FileUploadService,
    private formUtil: FormUtilsService,
    private service: MapEditorService
  ) {}

  ngOnInit() {
    this.mediator.onEditBasicInfo.subscribe((gameDefinition) => {
      this.gameDefinition = gameDefinition;
      this.form.patchValue(gameDefinition);
      
      // all game definitions except this one
      this.definitions = this.service
        .getGameDefinitions()
        .filter((definition) => definition.id != gameDefinition.id);

      if (gameDefinition.media) {
        this.preview = gameDefinition.media.thumbnail;
      } else {
        this.preview = this.NOTFOUND_IMAGE;
      }
    });

    this.form.valueChanges.subscribe(() => {
      this.save();
    });

    this.form.get("file").valueChanges.subscribe(() => {
      this.uploadImage();
    });
  }

  save() {
    if (this.form.valid) {
      const data = this.form.value as PartialModelGameDefinition;
      data.media = this.gameDefinition.media;
      this.mediator.onUpdateBasicInfo.next(data);
    }
  }

  uploadImage() {
    const file: File = this.form.get("file").value;

    this.formUtil.fileInputToBase64(file).subscribe((base64) => {
      const request = <ModelMediaRequest>{
        base64Data: base64,
        fileName: file.name,
      };
      this.uploader.upload(request).subscribe((media) => {
        this.gameDefinition.media = media;
        this.preview = media.thumbnail;
        this.save();
      });
    });
  }
}
