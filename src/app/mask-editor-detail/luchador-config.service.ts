import { Injectable } from "@angular/core";
import { MainConfig } from "../sdk";
import { NMSColor } from "../color-picker/nmscolor";
import { ShapeConfig } from "../shape-picker/shape-config";

@Injectable({
  providedIn: "root"
})
export class LuchadorConfigService {
  constructor(private nmsColor: NMSColor, private shapeConfig: ShapeConfig) {}

  getColor(configs: MainConfig [], key: string) {
    let found = configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : "#000000";
    return result;
  }

  getColorLabel(configs: MainConfig [], key: string) {
    const color = this.getColor(configs, key);
    return this.nmsColor.getColorName(color) + " (" + color + ")";
  }

  readonly EMPTY =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  getShape(configs: MainConfig [], key: string) {
    let found = configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? this.shapeConfig.path + found.value : this.EMPTY;
    return result;
  }

  getShapeNoDefaultValue(configs: MainConfig [], key: string) {
    let found = configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? this.shapeConfig.path + found.value : "";
    return result;
  }

  getShapeName(configs: MainConfig [], key: string) {
    let found = configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : "";
    return result;
  }
}
