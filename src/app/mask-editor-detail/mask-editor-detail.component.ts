import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { MainLuchador, MainConfig } from "../sdk";
import { NMSColor } from "../color-picker/nmscolor";

enum Category {
  mask,
  maskDecoration,
  face,
  mouthEyes,
  body
}

export class CategoryOptions {
  label: string;
  category: Category;
}

@Component({
  selector: "app-mask-editor-detail",
  templateUrl: "./mask-editor-detail.component.html",
  styleUrls: ["./mask-editor-detail.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class MaskEditorDetailComponent implements OnInit {
  @Input() luchador: MainLuchador;

  current = Category.mask;
  options = Category;

  categories = [
    { label: "Mask", category: Category.mask },
    { label: "Mask Decoration", category: Category.maskDecoration },
    { label: "Face", category: Category.face },
    { label: "Mouth / Eyes", category: Category.mouthEyes },
    { label: "Body", category: Category.body }
  ];

  constructor(private nmsColor: NMSColor) {}

  ngOnInit() {
    console.log("mask editor detail luchador", this.luchador);
  }

  setCurrent(category: Category) {
    this.current = category;
    console.log("current", this.current);
  }

  isCurrent(category: Category): boolean {
    return this.current === category;
  }

  update(key: string, value: string) {
    let found = this.luchador.configs.find((config: MainConfig) => {
      return config.key == key;
    });

    if (found) {
      found.value = value;
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
}