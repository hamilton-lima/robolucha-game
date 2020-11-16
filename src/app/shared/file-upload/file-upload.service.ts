import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { DefaultService, ModelMedia, ModelMediaRequest } from "src/app/sdk";
import { FileUploadResponse } from "./file-upload.model";

export interface FileUploadMonitor {
  response: Subject<FileUploadResponse>;
  progress: Subject<Number>;
}

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  constructor(private api: DefaultService) {}

  upload(request: ModelMediaRequest): Subject<ModelMedia> {
    const result = new Subject<ModelMedia>();

    this.api.privateMediaPost(request).subscribe((media) => {
      result.next(media);
    });

    return result;
  }
}
