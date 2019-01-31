import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { MainLuchador, MainConfig } from "../sdk";
import { NMSColor } from "../color-picker/nmscolor";
import { ShapeConfig } from "../shape-picker/shape-config";

enum EditorType {
  color,
  shape
}

export class CategoryOptions {
  id: string;
  label: string;
  subcategories: Array<SubCategoryOptions>;
}

export class SubCategoryOptions {
  label: string;
  type: EditorType;
  key: string;
}

@Component({
  selector: "app-mask-editor-detail",
  templateUrl: "./mask-editor-detail.component.html",
  styleUrls: ["./mask-editor-detail.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class MaskEditorDetailComponent implements OnInit {
  @Input() luchador: MainLuchador;

  categories = [
    {
      id: "mask",
      label: "Mask",
      subcategories: [
        {
          label: "Primary Color",
          type: EditorType.color,
          key: "mask.primary.color"
        },
        {
          label: "Secondary Color",
          type: EditorType.color,
          key: "mask.secondary.color"
        },
        { label: "Shape", type: EditorType.shape, key: "mask.shape" }
      ]
    },
    { id: "mask.decoration", label: "Mask Decoration" },
    { id: "face", label: "Face" },
    { id: "mouth-eyes", label: "Mouth / Eyes" },
    { id: "body", label: "Body" }
  ];

  // select the first by default
  current = this.categories[0].id;
  type = EditorType;

  constructor(private nmsColor: NMSColor, private shapeConfig: ShapeConfig) {}

  ngOnInit() {
    console.log("mask editor detail luchador", this.luchador);
  }

  setCurrent(id: string) {
    this.current = id;
    console.log("current", this.current);
  }

  isCurrent(id:string): boolean {
    return this.current === id;
  }

  update(key: string, value: string) {
    let found = this.luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    if (found) {
      found.value = value;
    } else {
      this.luchador.configs.push(<MainConfig>{
        key: key,
        value: value
      });
    }
  }

  getColor(key: string) {
    let found = this.luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : "#000000";
    return result;
  }

  getColorLabel(key: string) {
    const color = this.getColor(key);
    return this.nmsColor.getColorName(color) + " (" + color + ")";
  }

  readonly EMPTY =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  getShape(key: string) {
    let found = this.luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? this.shapeConfig.path + found.value : this.EMPTY;
    return result;
  }

  getShapeName(key: string) {
    let found = this.luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    let result = found ? found.value : "";
    return result;
  }
}
