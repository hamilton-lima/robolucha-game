import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { ModelConfig } from "../../../sdk";
import { Subscription } from "rxjs";
import { LuchadorConfigService } from "./luchador-config.service";
import { maskEditorCategories, EditorType } from "../mask-editor-category.model";
import { MaskEditorMediator, IMediatorData } from "../mask-editor.mediator";

@Component({
  selector: "app-mask-editor-detail",
  templateUrl: "./mask-editor-detail.component.html",
  styleUrls: ["./mask-editor-detail.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class MaskEditorDetailComponent implements OnInit, OnDestroy {
  @Output() onChange = new EventEmitter();

  categories = maskEditorCategories;
  // select the first by default
  current = this.categories[0].id;
  
  type = EditorType;
  configs: ModelConfig[];
  featuresChanges : string;
  subscription: Subscription;

  constructor(
    private mediator: MaskEditorMediator,
    private luchadorConfigs: LuchadorConfigService
  ) {}

  ngOnInit() {
    // console.log("mask editor detail luchador", this.configs);
    this.subscription = this.mediator.configs.subscribe(configs => {
      this.configs = configs;
      this.featuresChanges = this.mediator.featuresChanges;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setCurrent(id: string) {
    this.current = id;
    // console.log("current", this.current);
  }

  isCurrent(id: string): boolean {
    return this.current === id;
  }

  update(key: string, value: string) {
    let found = this.configs.find((config: ModelConfig) => {
      return config.key == key;
    });

    if (found) {
      found.value = value;
    } else {
      this.configs.push(<ModelConfig>{
        key: key,
        value: value
      });
    }

    let mediatorData : IMediatorData = {configs:this.configs, featuresChanges : this.featuresChanges};
    this.onChange.next(mediatorData);
  }

  getShapeName(key) {
    this.featuresChanges = "head";
    return this.luchadorConfigs.getShapeName(this.configs, key);
  }

  getColor(key) {
    this.featuresChanges = "body";
    return this.luchadorConfigs.getColor(this.configs, key);
  }

  getShape(key) {
    this.featuresChanges = "head";
    return this.luchadorConfigs.getShape(this.configs, key);
  }

  getColorLabel(key) {
    this.featuresChanges = "body";
    return this.luchadorConfigs.getColorLabel(this.configs, key);
  }
}
