import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { TextureBuilder } from "../arena/texture-builder";
import { ModelConfig } from "../sdk";

export class WallpaperConfig {
  width: number;
  height: number;
  border: number;
  maskWidth: number;
  maskHeight: number;
}

@Injectable({
  providedIn: "root",
})
export class WallPaperGeneratorService {
  constructor(private textureBuilder: TextureBuilder) {}

  generate(
    configs: ModelConfig[],
    wallPaperConfig: WallpaperConfig
  ): Promise<HTMLCanvasElement> {
    const self = this;
    return new Promise<HTMLCanvasElement>(function (resolve, reject) {
      self.textureBuilder.loadImages(configs).subscribe((images) => {
        const maskBuilders = [];
        configs.forEach((config) =>
          maskBuilders.push(
            self.generateOneMask(self, config, images, wallPaperConfig)
          )
        );
        forkJoin(maskBuilders).subscribe((masks) => {
          resolve(self.assembleWallpaper(self, masks, wallPaperConfig));
        });
      });
    });
  }

  assembleWallpaper(
    self: WallPaperGeneratorService,
    masks: HTMLCanvasElement[],
    wallPaperConfig: WallpaperConfig
  ): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>(function (resolve, reject) {

      // build blank canvas
      const canvas = self.buildEmptyCanvas(wallPaperConfig);
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;

      // draw masks
      ctx.drawImage(masks[0], 0, 0);
      resolve(canvas);
    });
  }

  buildEmptyCanvas(wallPaperConfig: WallpaperConfig): HTMLCanvasElement{
    let canvas = document.createElement("canvas");
    canvas.width = wallPaperConfig.width;
    canvas.height = wallPaperConfig.height;
    return canvas;
  }

  generateOneMask(self: WallPaperGeneratorService, config, images, wallPaperConfig: WallpaperConfig) {
    return new Promise<HTMLCanvasElement>(function (resolve, reject) {
      // build mask
      self.textureBuilder.buildMask(config, images).then((maskBuild) => {
        const mask = maskBuild.square;

        // build base canvas as background with the body color
        self.textureBuilder
          .buildCanvasFromColor(
            config,
            "skin.color",
            "rect",
            wallPaperConfig.maskWidth,
            wallPaperConfig.maskHeight
          )
          .then((canvas) => {
            // build face base
            self.textureBuilder
              .buildLayerFromColor(config, images, "base", "mask.primary.color")
              .then((faceBackground) => {
                // assemble the mask with the background
                let context = canvas.getContext("2d");
                const x = wallPaperConfig.border;
                const y = wallPaperConfig.border;

                const w =
                  wallPaperConfig.maskWidth - 2 * wallPaperConfig.border;
                const h =
                  wallPaperConfig.maskHeight - 2 * wallPaperConfig.border;

                context.drawImage(faceBackground, x, y, w, h);
                context.drawImage(mask, x, y, w, h);
                resolve(canvas);
              });
          });
      });
    });
  }
}
