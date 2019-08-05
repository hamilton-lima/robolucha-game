import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ModelConfig } from "../sdk";

@Injectable({
  providedIn: "root"
})
export class MaskEditorMediator {
  configs: BehaviorSubject<ModelConfig[]> = new BehaviorSubject([]);
}
