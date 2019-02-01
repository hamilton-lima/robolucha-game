import { Injectable } from "@angular/core";
import { MainLuchador, MainConfig } from "../sdk";

@Injectable({
  providedIn: "root"
})
export class TextureBuilder {
  build(
    luchador: MainLuchador,
    images: Array<HTMLImageElement>,
    width: number,
    height: number
  ): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      // temporary canvas
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext("2d");
      context.imageSmoothingEnabled = true;

      // draw skin
      context.fillStyle = this.getValue(luchador, "skin.color");
      context.fillRect(0, 0, width, height);
      context.fill();

      // self.loadImage("back"),
      // self.loadImage("face"),

      // TODO: change promises to return canvas
      let promises = [];
      promises.push(
        this.buildLayerFromColor(luchador, images, "feet", "feet.color")
      );
      promises.push(
        this.buildLayerFromColor(luchador, images, "wrist", "wrist.color")
      );
      promises.push(
        this.buildLayerFromColor(luchador, images, "ankle", "ankle.color")
      );
      // promises.push(this.buildMask(luchador, images));

      Promise.all(promises).then(images => {
        images.forEach(image => {
          context.drawImage(image, 0, 0);
        });
        resolve(canvas);
      });
      // .then(image => {
      //   context.drawImage(image, 0, 0);
      //   resolve(canvas);
      // });

      // // draw layers

      //      return canvas;
    });
  }

  buildMask(
    luchador: MainLuchador,
    images: Array<HTMLImageElement>
  ): Promise<HTMLCanvasElement> {
    const self = this;

    return new Promise<HTMLCanvasElement>(function(resolve, reject) {
    // let color = self.getValue(luchador, colorName);
    // console.log("color", color);

    // const image = images.find(image => {
    //   return image.name == imageName;
    // });
    // console.log("image", image);



    });
  }

  buildLayerFromColor(
    luchador: MainLuchador,
    images: Array<HTMLImageElement>,
    imageName: string,
    colorName: string
  ): Promise<HTMLCanvasElement> {
    const self = this;

    let color = self.getValue(luchador, colorName);
    console.log("color", color);

    const image = images.find(image => {
      return image.name == imageName;
    });
    console.log("image", image);

    return self.tint(image, color);
  }

  getValue(luchador: MainLuchador, key: string): string {
    let found = luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : "#000000";
    return result;
  }

  tint(img, color): Promise<HTMLCanvasElement> {
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

      ctx.globalCompositeOperation = "source-in";
      ctx.drawImage(buffer, 0, 0);
      resolve(canvas);

      // var image = new Image();
      // image.name = img.name;

      // image.onload = function() {
      //   resolve(image);
      // };

      // image.src = canvas.toDataURL("image/png");
    });
  }
}
