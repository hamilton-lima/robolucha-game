import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MainLuchador } from "../sdk";

@Injectable({
  providedIn: "root"
})
export class MaskEditorMediator {
  luchador: BehaviorSubject<MainLuchador> = new BehaviorSubject(null);
}
