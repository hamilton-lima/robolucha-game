import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {
  constructor() { 
  }

  // converts a file from a <input type="file"> to Base64 
  fileInputToBase64(file): Subject<string> {
    const result = new Subject<string>();
    const reader = new FileReader();

    reader.onloadend = function () {
      result.next(reader.result.toString());
    };

    reader.readAsDataURL(file);
    return result;
  }
}
