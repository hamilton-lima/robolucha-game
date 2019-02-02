import { Injectable } from "@angular/core";
import { MainConfig, MainLuchador } from "../sdk";
import { NMSColor } from "../color-picker/nmscolor";
import { ShapeConfig } from "../shape-picker/shape-config";

@Injectable({
  providedIn: "root"
})
export class LuchadorConfigService {
  constructor(private nmsColor: NMSColor, private shapeConfig: ShapeConfig) {}

  getColor(luchador: MainLuchador, key: string) {
    let found = luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : "#000000";
    return result;
  }

  getColorLabel(luchador: MainLuchador, key: string) {
    const color = this.getColor(luchador, key);
    return this.nmsColor.getColorName(color) + " (" + color + ")";
  }

  readonly EMPTY =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  getShape(luchador: MainLuchador, key: string) {
    let found = luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? this.shapeConfig.path + found.value : this.EMPTY;
    return result;
  }

  getShapeNoDefaultValue(luchador: MainLuchador, key: string) {
    let found = luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? this.shapeConfig.path + found.value : "";
    return result;
  }

  getShapeName(luchador: MainLuchador, key: string) {
    let found = luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : "";
    return result;
  }
}
