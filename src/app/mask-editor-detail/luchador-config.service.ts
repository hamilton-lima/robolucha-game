import { Injectable } from "@angular/core";
import { ModelConfig } from "../sdk";
import { NMSColor } from "../color-picker/nmscolor";
import { ShapeConfig } from "../shape-picker/shape-config";

@Injectable({
  providedIn: "root"
})
export class LuchadorConfigService {
  constructor(private nmsColor: NMSColor, private shapeConfig: ShapeConfig) {}

  getColor(configs: ModelConfig [], key: string) {
    let found = configs.find((config: ModelConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : "#000000";
    return result;
  }

  getColorLabel(configs: ModelConfig [], key: string) {
    const color = this.getColor(configs, key);
    return this.nmsColor.getColorName(color) + " (" + color + ")";
  }

  readonly EMPTY =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  getShape(configs: ModelConfig [], key: string) {
    let found = configs.find((config: ModelConfig) => {
      return config.key == key;
    });

    let result = found ? this.shapeConfig.path + found.value : this.EMPTY;
    return result;
  }

  getShapeNoDefaultValue(configs: ModelConfig [], key: string) {
    let found = configs.find((config: ModelConfig) => {
      return config.key == key;
    });

    let result = found ? this.shapeConfig.path + found.value : "";
    return result;
  }

  getShapeName(configs: ModelConfig [], key: string) {
    let found = configs.find((config: ModelConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : "";
    return result;
  }
}
