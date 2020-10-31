import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { TextureBuilder } from "../arena/texture-builder";
import { ModelConfig } from "../sdk";

export class WallpaperDimension {
  widthCount: number;
  heightCount: number;
}

class WallpaperMaskConfig {
  width: number;
  height: number;
  border: number;
}

@Injectable({
  providedIn: "root",
})
export class WallPaperGeneratorService {
  readonly maskConfig: WallpaperMaskConfig = {
    width: 200,
    height: 200,
    border: 10,
  };

  constructor(private textureBuilder: TextureBuilder) {}

  generate(
    configs: Array<ModelConfig[]>,
    dimension: WallpaperDimension
  ): Promise<HTMLCanvasElement> {
    const self = this;
    return new Promise<HTMLCanvasElement>(function (resolve, reject) {
      self.loadAllImages(configs).subscribe((images) => {
        const maskBuilders = [];
        configs.forEach((config) =>
          maskBuilders.push(self.generateOneMask(self, config, images))
        );
        forkJoin(maskBuilders).subscribe((masks) => {
          resolve(self.assembleWallpaper(self, masks, dimension));
        });
      });
    });
  }

  loadAllImages(configs: Array<ModelConfig[]>): Observable<HTMLImageElement[]> {
    const self = this;

    const images2Load = [];
    // base aroung the mask
    images2Load.push(self.textureBuilder.loadImage("base"));

    // each mask element image to be tinted
    configs.forEach((config) => {
      this.textureBuilder
        .findImagesFromShapes(config)
        .forEach((image) => images2Load.push(image));
    });

    return forkJoin(images2Load);
  }

  assembleWallpaper(
    self: WallPaperGeneratorService,
    masks: HTMLCanvasElement[],
    dimension: WallpaperDimension
  ): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>(function (resolve, reject) {
      // build blank canvas
      const canvas = self.buildEmptyCanvas(dimension);
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;

      let x = 0;
      let y = 0;
      let pos = 0;

      for (let h = 0; h < dimension.heightCount; h++) {
        for (let w = 0; w < dimension.widthCount; w++) {
          ctx.drawImage(masks[pos], x, y);
          pos++;
          x = x + self.maskConfig.width;
        }
        x = 0;
        y = y + self.maskConfig.height;
      }

      resolve(canvas);
    });
  }

  buildEmptyCanvas(dimension: WallpaperDimension): HTMLCanvasElement {
    let canvas = document.createElement("canvas");
    canvas.width = dimension.widthCount * this.maskConfig.width;
    canvas.height = dimension.heightCount * this.maskConfig.height;
    return canvas;
  }

  generateOneMask(self: WallPaperGeneratorService, config, images) {
    return new Promise<HTMLCanvasElement>(function (resolve, reject) {
      // build base canvas as background with the body color
      self.textureBuilder
        .buildCanvasFromColor(
          config,
          "skin.color",
          "rect",
          self.maskConfig.width,
          self.maskConfig.height
        )
        .then((canvas) => {
          // build face base
          self.textureBuilder
            .buildLayerFromColor(config, images, "base", "mask.primary.color")
            .then((faceBackground) => {
              // build mask
              self.textureBuilder
                .buildMask(config, images)
                .then((maskBuild) => {
                  const mask = maskBuild.square;

                  // assemble the mask with the background
                  let context = canvas.getContext("2d");
                  const x = self.maskConfig.border;
                  const y = self.maskConfig.border;

                  const w = self.maskConfig.width - 2 * self.maskConfig.border;
                  const h = self.maskConfig.height - 2 * self.maskConfig.border;

                  context.drawImage(faceBackground, x, y, w, h);
                  context.drawImage(mask, x, y, w, h);
                  resolve(canvas);
                });
            });
        });
    });
  }
}
