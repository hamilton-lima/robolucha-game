import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MainConfig } from "../sdk";

@Injectable({
  providedIn: "root"
})
export class MaskEditorMediator {
  configs: BehaviorSubject<MainConfig[]> = new BehaviorSubject([]);
}
