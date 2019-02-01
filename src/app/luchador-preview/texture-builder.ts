import { Injectable } from "@angular/core";
import { MainLuchador, MainConfig } from "../sdk";

@Injectable({
  providedIn: "root"
})
export class TextureBuilder {
  build(luchador: MainLuchador, images, width, height): HTMLCanvasElement {
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

    // draw layers
    images.forEach(image => {
      context.drawImage(image, 0, 0);
    });

    return canvas;
  }

  getValue(luchador: MainLuchador, key: string): string {
    let found = luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : "#000000";
    return result;
  }

  hexToRgb(hex) {
    if (hex.startsWith("#")) {
      hex = hex.substring(1);
    }

    var bigint = parseInt(hex, 16);
    var _r = (bigint >> 16) & 255;
    var _g = (bigint >> 8) & 255;
    var _b = bigint & 255;
    return {
      red: _r,
      green: _g,
      blue: _b
    };
  }

  tint(img, red, green, blue, name) {
    var foo = document.createElement("canvas");
    foo.width = img.width;
    foo.height = img.height;
    var ctx = foo.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, 0, 0);

    var imageData = ctx.getImageData(0, 0, img.width, img.height);
    var data = imageData.data;

    var l = data.length;
    var counter = 0;
    for (var i = 0; i < l; i += 4) {
      data[i] = data[i] + red;
      data[i + 1] = data[i + 1] + green;
      data[i + 2] = data[i + 2] + blue;
    }

    ctx.putImageData(imageData, 0, 0);
    var promise = new Promise(function(resolve, reject) {
      var image = new Image();
      image.name = name;

      image.onload = function() {
        resolve(image);
      };

      image.src = foo.toDataURL("image/png");
    });

    return promise;
  }
}
