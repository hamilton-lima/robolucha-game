import { Injectable } from "@angular/core";
import { ModelConfig } from "../sdk";
import { Subject, forkJoin } from "rxjs";

import { LuchadorConfigService } from "../pages/mask-editor/mask-editor-detail/luchador-config.service";
import {
  maskEditorCategories,
  CategoryOptions,
  EditorType,
} from "../pages/mask-editor/mask-editor-category.model";

const TEXTURE_WIDTH = 512;
const TEXTURE_HEIGHT = 512;

export class DynamicTexture {
  material: BABYLON.StandardMaterial;
  mask: HTMLCanvasElement;
}

class PartialTextureBuild {
  canvas: HTMLCanvasElement;
  mask: HTMLCanvasElement;
}

class MaskBuild {
  texturePartial: HTMLCanvasElement;
  square: HTMLCanvasElement;
}

@Injectable({
  providedIn: "root",
})
export class TextureBuilder {
  constructor(private luchadorConfigs: LuchadorConfigService) {}

  private build(
    configs: ModelConfig[],
    images: Array<HTMLImageElement>,
    width: number,
    height: number
  ): Promise<PartialTextureBuild> {
    return new Promise<PartialTextureBuild>((resolve, reject) => {
      const result = new PartialTextureBuild();
      result.canvas = document.createElement("canvas");
      result.canvas.width = width;
      result.canvas.height = height;
      let context = result.canvas.getContext("2d");
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

      promises.push(
        this.buildMask(configs, images).then((canvas) => {
          result.mask = canvas.square;
          return Promise.resolve(canvas.texturePartial);
        })
      );

      Promise.all(promises)
        .then((images) => {
          images.forEach((image) => {
            context.drawImage(image, 0, 0);
          });
          resolve(result);
        })
        .catch(function (error) {
          console.error("Error drawing texture", error);
        });
    });
  }

  private readonly maskLayers = { x: 229, y: 65 };

  private buildMask(
    configs: ModelConfig[],
    images: Array<HTMLImageElement>
  ): Promise<MaskBuild> {
    const target = this;

    return new Promise<MaskBuild>(function (resolve, reject) {
      // texture background
      const canvasPromise = target.buildLayerFromColor(
        configs,
        images,
        "face",
        "mask.primary.color"
      );

      // square background
      const square = target.buildCanvasFromColor(
        configs,
        "skin.color",
        "square",
        200,
        200
      );

      const faceBackground = target.buildLayerFromColor(
        configs,
        images,
        "base",
        "mask.primary.color"
      );

      Promise.all([canvasPromise, square, faceBackground])
        .then((backgrounds) => {
          const result = new MaskBuild();

          result.texturePartial = backgrounds[0];// backgrounds.find((one) => one.id != "square");
          result.square = backgrounds[1]; // backgrounds.find((one) => one.id == "square");
          const faceBackground = backgrounds[2];

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

          let mouthImage = images.find((image) => {
            return image.name == "mouth.shape";
          });
          const mouth = target.image2Canvas(mouthImage);

          const promises = [
            maskShape,
            topDecoration,
            bottomDecoration,
            eyes,
            mouth,
          ];

          Promise.all(promises)
            .then((tintedLayers) => {
              const context = result.texturePartial.getContext("2d");

              const contextSquare = result.square.getContext("2d");
              contextSquare.drawImage(faceBackground, 0, 0);

              tintedLayers.forEach((layer) => {
                // draw for the texture
                context.drawImage(
                  layer,
                  target.maskLayers.x,
                  target.maskLayers.y
                );

                // draw for the square
                contextSquare.drawImage(layer, 0, 0);
              });

              resolve(result);
            })
            .catch(function (error) {
              console.error("Error drawing mask layers", error);
            });
        })
        .catch(function (error) {
          console.error("Error building base mask layer", error);
        });
    });
  }

  private image2Canvas(img: HTMLImageElement): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>(function (resolve, reject) {
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

  private buildCanvasFromColor(
    configs: ModelConfig[],
    colorName: string,
    id: string,
    width: number,
    height: number
  ): Promise<HTMLCanvasElement> {
    const target = this;

    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.id = id;
      canvas.width = width;
      canvas.height = height;

      let context = canvas.getContext("2d");
      context.imageSmoothingEnabled = true;

      let color = target.getValue(configs, colorName, "#000000");
      context.fillStyle = color;
      context.fillRect(0, 0, width, height);
      context.fill();

      resolve(canvas);
    });
  }

  private buildLayerFromColor(
    configs: ModelConfig[],
    images: Array<HTMLImageElement>,
    imageName: string,
    colorName: string
  ): Promise<HTMLCanvasElement> {
    const target = this;

    let color = target.getValue(configs, colorName, "#000000");
    const image = images.find((image) => {
      return image.name == imageName;
    });

    if (image) {
      return target.tint(image, color);
    } else {
      let canvas = document.createElement("canvas");
      return Promise.resolve(canvas);
    }
  }

  private getValue(
    configs: ModelConfig[],
    key: string,
    defaultValue: string
  ): string {
    let found = configs.find((config: ModelConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : defaultValue;
    return result;
  }

  private tint(
    img: HTMLImageElement,
    color: string
  ): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>(function (resolve, reject) {
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
    configs: ModelConfig[],
    scene: BABYLON.Scene
  ): Promise<DynamicTexture> {
    const self = this;

    return new Promise<DynamicTexture>(function (resolve, reject) {
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

      const result: DynamicTexture = new DynamicTexture();

      result.material = new BABYLON.StandardMaterial(
        "luchador-preview-material",
        scene
      );

      result.material.diffuseTexture = dynamicTexture;
      result.material.specularColor = new BABYLON.Color3(0, 0, 0);
      result.material.ambientColor = new BABYLON.Color3(0.588, 0.588, 0.588);

      let images2Load = [
        self.loadImage("back"),
        self.loadImage("face"),
        self.loadImage("wrist"),
        self.loadImage("ankle"),
        self.loadImage("feet"),
        self.loadImage("base"),
      ];

      self.addImagesFromShapes(configs, images2Load, maskEditorCategories);

      let sequence = forkJoin(images2Load);
      sequence.subscribe((images: Array<HTMLImageElement>) => {
        if (configs) {
          self
            .build(configs, images, TEXTURE_WIDTH, TEXTURE_HEIGHT)
            .then((partial) => {
              context.drawImage(partial.canvas, 0, 0);
              result.mask = partial.mask;
              dynamicTexture.update();
              resolve(result);
            });
        }
      });
    });
  }

  /** Finds all shape image names and create the Loader for each one */
  private addImagesFromShapes(
    configs: ModelConfig[],
    images2Load: Array<Subject<HTMLImageElement>>,
    categories: Array<CategoryOptions>
  ) {
    categories.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
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
