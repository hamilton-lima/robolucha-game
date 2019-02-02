import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { MainLuchador, MainConfig } from "../sdk";
import { NMSColor } from "../color-picker/nmscolor";
import { ShapeConfig } from "../shape-picker/shape-config";
import { MaskEditorMediator } from "../mask-editor/mask-editor.mediator";
import { Subscription } from "rxjs";
import { LuchadorConfigService } from "./luchador-config.service";
import { EditorType, maskEditorCategories } from "../mask-editor/mask-editor-category.model";

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
  luchador: MainLuchador;
  subscription: Subscription;

  constructor(
    private nmsColor: NMSColor,
    private shapeConfig: ShapeConfig,
    private mediator: MaskEditorMediator,
    private luchadorConfigs: LuchadorConfigService
  ) {}

  ngOnInit() {
    console.log("mask editor detail luchador", this.luchador);
    this.subscription = this.mediator.luchador.subscribe(luchador => {
      this.luchador = luchador;
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
    let found = this.luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    if (found) {
      found.value = value;
    } else {
      this.luchador.configs.push(<MainConfig>{
        key: key,
        value: value
      });
    }

    this.onChange.next(this.luchador);
  }

  getShapeName(key) {
    return this.luchadorConfigs.getShapeName(this.luchador, key);
  }

  getColor(key) {
    return this.luchadorConfigs.getColor(this.luchador, key);
  }

  getShape(key) {
    return this.luchadorConfigs.getShape(this.luchador, key);
  }

  getColorLabel(key) {
    return this.luchadorConfigs.getColorLabel(this.luchador, key);
  }
}
