import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ModelConfig } from "src/app/sdk";

export enum FeatureChange{
  Default = "default",
  Head = "head",
  Body = "body"
}

export interface IMediatorData{
  configs : ModelConfig[];
  featuresChanges : string;
}

@Injectable({
  providedIn: "root"
})
export class MaskEditorMediator {
  configs: BehaviorSubject<ModelConfig[]> = new BehaviorSubject([]);
  mask: BehaviorSubject<HTMLCanvasElement>  = new BehaviorSubject(null);
  featuresChanges : string;
}
