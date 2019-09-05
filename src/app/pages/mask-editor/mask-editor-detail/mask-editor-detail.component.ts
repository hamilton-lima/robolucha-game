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
import { MaskEditorMediator } from "../mask-editor.mediator";

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
  subscription: Subscription;

  constructor(
    private mediator: MaskEditorMediator,
    private luchadorConfigs: LuchadorConfigService
  ) {}

  ngOnInit() {
    console.log("mask editor detail luchador", this.configs);
    this.subscription = this.mediator.configs.subscribe(configs => {
      this.configs = configs;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setCurrent(id: string) {
    this.current = id;
    console.log("current", this.current);
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

    this.onChange.next(this.configs);
  }

  getShapeName(key) {
    return this.luchadorConfigs.getShapeName(this.configs, key);
  }

  getColor(key) {
    return this.luchadorConfigs.getColor(this.configs, key);
  }

  getShape(key) {
    return this.luchadorConfigs.getShape(this.configs, key);
  }

  getColorLabel(key) {
    return this.luchadorConfigs.getColorLabel(this.configs, key);
  }
}
