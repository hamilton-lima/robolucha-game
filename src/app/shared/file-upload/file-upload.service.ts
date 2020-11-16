import { HttpClient, HttpEventType } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { FileUploadResponse } from "./file-upload.model";

export interface FileUploadMonitor {
  response: Subject<FileUploadResponse>;
  progress: Subject<Number>;
}

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  findOne(id: string): Subject<FileUploadResponse> {
    const result:Subject<FileUploadResponse> = new Subject();

    this.http
      .get(environment.UPLOAD_BASEPATH + "/files/" + id)
      .subscribe((event) => {
          result.next(event as FileUploadResponse);
      });

    return result;
  }


  upload(data: FormData): FileUploadMonitor {
    const result = <FileUploadMonitor>{
      response: new Subject(),
      progress: new Subject(),
    };

    this.http
      .post(environment.UPLOAD_BASEPATH, data, {
        observe: "events",
        reportProgress: true,
      })
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round((100 * event.loaded) / event.total);
          result.progress.next(progress);
        }

        if (event.type === HttpEventType.Response) {
          result.response.next(event.body[0] as FileUploadResponse);
        }
      });

    return result;
  }
}
