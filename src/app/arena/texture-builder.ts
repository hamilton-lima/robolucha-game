import { Injectable } from "@angular/core";
import { MainConfig } from "../sdk";
import { Subject, forkJoin } from "rxjs";
import {
  maskEditorCategories,
  CategoryOptions,
  EditorType
} from "../mask-editor/mask-editor-category.model";
import { LuchadorConfigService } from "../mask-editor-detail/luchador-config.service";

const TEXTURE_WIDTH = 512;
const TEXTURE_HEIGHT = 512;

@Injectable({
  providedIn: "root"
})
export class TextureBuilder {
  constructor(private luchadorConfigs: LuchadorConfigService) {}

  private build(
    configs: MainConfig [],
    images: Array<HTMLImageElement>,
    width: number,
    height: number
  ): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext("2d");
      context.imageSmoothingEnabled = true;

      // draw skin
      context.fillStyle = this.getValue(configs, "skin.color", "#FFFFFF");
      context.fillRect(0, 0, width, height);
      context.fill();

      let promises = [];
      promises.push(
        this.buildLayerFromColor(configs, images, "feet", "feet.color")
      );

      promises.push(
        this.buildLayerFromColor(configs, images, "wrist", "wrist.color")
      );

      promises.push(
        this.buildLayerFromColor(configs, images, "ankle", "ankle.color")
      );

      promises.push(
        this.buildLayerFromColor(configs, images, "back", "mask.primary.color")
      );

      promises.push(this.buildMask(configs, images));

      Promise.all(promises)
        .then(images => {
          images.forEach(image => {
            context.drawImage(image, 0, 0);
          });
          resolve(canvas);
        })
        .catch(function(error) {
          console.error("Error drawing texture", error);
        });
    });
  }

  private readonly maskLayers = { x: 229, y: 65 };

  private buildMask(
    configs: MainConfig [],
    images: Array<HTMLImageElement>
  ): Promise<HTMLCanvasElement> {
    const target = this;

    return new Promise<HTMLCanvasElement>(function(resolve, reject) {
      const canvasPromise = target.buildLayerFromColor(
        configs,
        images,
        "face",
        "mask.primary.color"
      );

      canvasPromise
        .then(canvas => {
          let maskShape = target.buildLayerFromColor(
            configs,
            images,
            "mask.shape",
            "mask.secondary.color"
          );

          let topDecoration = target.buildLayerFromColor(
            configs,
            images,
            "mask.decoration.top.shape",
            "mask.decoration.top.color"
          );

          let bottomDecoration = target.buildLayerFromColor(
            configs,
            images,
            "mask.decoration.bottom.shape",
            "mask.decoration.bottom.color"
          );

          let eyes = target.buildLayerFromColor(
            configs,
            images,
            "eyes.shape",
            "eyes.color"
          );

          let mouthImage = images.find(image => {
            return image.name == "mouth.shape";
          });
          const mouth = target.image2Canvas(mouthImage);

          const promises = [
            maskShape,
            topDecoration,
            bottomDecoration,
            eyes,
            mouth
          ];

          Promise.all(promises)
            .then(tintedLayers => {
              const context = canvas.getContext("2d");
              console.log("drawing layers", tintedLayers, target.maskLayers);
              tintedLayers.forEach(layer => {
                context.drawImage(
                  layer,
                  target.maskLayers.x,
                  target.maskLayers.y
                );
              });
              resolve(canvas);
            })
            .catch(function(error) {
              console.error("Error drawing mask layers", error);
            });
        })
        .catch(function(error) {
          console.error("Error building base mask layer", error);
        });
    });
  }

  private image2Canvas(img: HTMLImageElement): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>(function(resolve, reject) {
      let canvas = document.createElement("canvas");
      if (img) {
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;

        ctx.drawImage(img, 0, 0);
      } else {
        canvas.width = 1;
        canvas.height = 1;
      }

      resolve(canvas);
    });
  }

  private buildLayerFromColor(
    configs: MainConfig [],
    images: Array<HTMLImageElement>,
    imageName: string,
    colorName: string
  ): Promise<HTMLCanvasElement> {
    const target = this;

    let color = target.getValue(configs, colorName, "#000000");
    const image = images.find(image => {
      return image.name == imageName;
    });

    console.log("buildLayerFromColor", imageName, image, colorName, color);

    if (image) {
      return target.tint(image, color);
    } else {
      let canvas = document.createElement("canvas");
      return Promise.resolve(canvas);
    }
  }

  private getValue(configs: MainConfig [], key: string, defaultValue: string): string {
    let found = configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : defaultValue;
    return result;
  }

  private tint(img: HTMLImageElement, color: string): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>(function(resolve, reject) {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;

      ctx.drawImage(img, 0, 0);

      var buffer = document.createElement("canvas");
      buffer.width = img.width;
      buffer.height = img.height;
      var bx = buffer.getContext("2d");

      bx.fillStyle = color;
      bx.fillRect(0, 0, img.width, img.height);
      bx.fill();

      let originalComposition = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "source-in";
      ctx.drawImage(buffer, 0, 0);
      ctx.globalCompositeOperation = originalComposition;
      resolve(canvas);
    });
  }

  public loadDynamicTexture(
    configs: MainConfig [],
    scene: BABYLON.Scene
  ): Promise<BABYLON.StandardMaterial> {
    const self = this;

    return new Promise<BABYLON.StandardMaterial>(function(resolve, reject) {
      let dynamicTexture = new BABYLON.DynamicTexture(
        "luchador-preview-dynamic-texture",
        TEXTURE_WIDTH,
        scene,
        true
      );

      let context = dynamicTexture.getContext();
      dynamicTexture.wrapR = 1;
      dynamicTexture.wrapU = 1;
      dynamicTexture.wrapV = 1;

      let material = new BABYLON.StandardMaterial(
        "luchador-preview-material",
        scene
      );

      material.diffuseTexture = dynamicTexture;
      material.specularColor = new BABYLON.Color3(0, 0, 0);
      material.ambientColor = new BABYLON.Color3(0.588, 0.588, 0.588);

      let images2Load = [
        self.loadImage("back"),
        self.loadImage("face"),
        self.loadImage("wrist"),
        self.loadImage("ankle"),
        self.loadImage("feet")
      ];

      self.addImagesFromShapes(configs, images2Load, maskEditorCategories);

      let sequence = forkJoin(images2Load);

      sequence.subscribe((images: Array<HTMLImageElement>) => {
        console.log("all images loaded", images.map(image => image.name));

        if (configs) {
          self.build(configs, images, TEXTURE_WIDTH, TEXTURE_HEIGHT).then(
            canvas => {
              // target.debug.nativeElement.getContext("2d").drawImage(canvas, 0, 0);
              context.drawImage(canvas, 0, 0);
              dynamicTexture.update();
            }
          );
        }
      });

      resolve(material);
    });
  }

  /** Finds all shape image names and create the Loader for each one */
  private addImagesFromShapes(
    configs: MainConfig [],
    images2Load: Array<Subject<HTMLImageElement>>,
    categories: Array<CategoryOptions>
  ) {

    categories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        if (subcategory.type == EditorType.shape) {
          const fileName = this.luchadorConfigs.getShapeNoDefaultValue(
            configs,
            subcategory.key
          );

          if (fileName) {
            images2Load.push(
              this.loadImageFromFileName(fileName, subcategory.key)
            );
          }
        }
      });
    });
  }

  private loadImage(name): Subject<HTMLImageElement> {
    const fileName = "assets/shapes/" + name + ".png";
    return this.loadImageFromFileName(fileName, name);
  }

  private loadImageFromFileName(fileName, name): Subject<HTMLImageElement> {
    let result = new Subject<HTMLImageElement>();
    let img = new Image();
    img.name = name;

    img.src = fileName;
    img.onload = () => {
      result.next(img);
      result.complete();
    };
    return result;
  }
}
