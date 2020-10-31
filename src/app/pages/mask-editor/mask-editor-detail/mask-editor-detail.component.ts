import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { ModelConfig } from "../../../sdk";
import { Subscription } from "rxjs";
import { LuchadorConfigService } from "./luchador-config.service";
import {
  maskEditorCategories,
  EditorType,
} from "../mask-editor-category.model";
import {
  MaskEditorMediator,
  IMediatorData,
  FeatureChange,
} from "../mask-editor.mediator";
import { TextureBuilder } from "src/app/arena/texture-builder";

interface MaskPreview {
  width: number;
  height: number;
  border: number;
}

@Component({
  selector: "app-mask-editor-detail",
  templateUrl: "./mask-editor-detail.component.html",
  styleUrls: ["./mask-editor-detail.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class MaskEditorDetailComponent implements OnInit, OnDestroy {
  @Output() onChange = new EventEmitter();

  categories = maskEditorCategories;
  // select the first by default
  current = this.categories[0].id;

  // mask preview
  maskPreviewConfig: MaskPreview = {
    width: 200,
    height: 200,
    border: 10,
  };

  type = EditorType;
  configs: ModelConfig[];
  featuresChanges: string;
  subscriptions: Subscription[] = [];
  previewImageData: string = "assets/maps/image-not-found.png";

  constructor(
    private mediator: MaskEditorMediator,
    private luchadorConfigs: LuchadorConfigService,
    private textureBuilder: TextureBuilder
  ) {}

  ngOnInit() {
    // console.log("mask editor detail luchador", this.configs);
    this.subscriptions.push(
      this.mediator.configs.subscribe((configs) => {
        this.configs = configs;
        this.featuresChanges = this.mediator.featuresChanges;
        this.updatePreview();
      })
    );

    // update mask preview
    this.subscriptions.push(
      this.mediator.mask.subscribe((mask) => {
        if (mask) {
          // load images that can be tinted
          this.textureBuilder.loadImages(this.configs).subscribe((images) => {
            // build base canvas as background with the body color
            const rectangle = this.textureBuilder
              .buildCanvasFromColor(
                this.configs,
                "skin.color",
                "rect",
                this.maskPreviewConfig.width,
                this.maskPreviewConfig.height
              )
              .then((canvas) => {
                // build face base
                this.textureBuilder
                  .buildLayerFromColor(
                    this.configs,
                    images,
                    "base",
                    "mask.primary.color"
                  )
                  .then((faceBackground) => {
                    let context = canvas.getContext("2d");
                    const x = this.maskPreviewConfig.border;
                    const y = this.maskPreviewConfig.border;

                    const w =
                      this.maskPreviewConfig.width -
                      2 * this.maskPreviewConfig.border;
                    const h =
                      this.maskPreviewConfig.height -
                      2 * this.maskPreviewConfig.border;

                    context.drawImage(faceBackground, x, y, w, h);
                    context.drawImage(mask, x, y, w, h);
                    this.previewImageData = canvas.toDataURL("image/png");
                  });
              });
          });
        }
      })
    );
  }

  updatePreview() {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  setCurrent(id: string) {
    this.current = id;
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
        value: value,
      });
    }

    let mediatorData: IMediatorData = {
      configs: this.configs,
      featuresChanges: this.featuresChanges,
    };
    this.onChange.next(mediatorData);
  }

  getShapeName(key) {
    this.featuresChanges = FeatureChange.Head;
    return this.luchadorConfigs.getShapeName(this.configs, key);
  }

  getColor(key) {
    this.featuresChanges = FeatureChange.Body;
    return this.luchadorConfigs.getColor(this.configs, key);
  }

  getShape(key) {
    this.featuresChanges = FeatureChange.Head;
    return this.luchadorConfigs.getShape(this.configs, key);
  }

  getColorLabel(key) {
    this.featuresChanges = FeatureChange.Body;
    return this.luchadorConfigs.getColorLabel(this.configs, key);
  }
}
