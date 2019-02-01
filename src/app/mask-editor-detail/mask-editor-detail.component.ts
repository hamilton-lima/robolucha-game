import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { MainLuchador, MainConfig } from "../sdk";
import { NMSColor } from "../color-picker/nmscolor";
import { ShapeConfig } from "../shape-picker/shape-config";
import { MaskEditorMediator } from "../mask-editor/mask-editor.mediator";
import { Subscription } from "rxjs";

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
export class MaskEditorDetailComponent implements OnInit, OnDestroy {
  @Output() onChange = new EventEmitter();

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
    {
      id: "mask.decoration",
      label: "Mask Decoration",
      subcategories: [
        {
          label: "Top Color",
          type: EditorType.color,
          key: "mask.decoration.top.color"
        },
        {
          label: "Top Shape",
          type: EditorType.shape,
          key: "mask.decoration.top.shape"
        },
        {
          label: "Bottom Color",
          type: EditorType.color,
          key: "mask.decoration.bottom.color"
        },
        {
          label: "bottom Shape",
          type: EditorType.shape,
          key: "mask.decoration.bottom.shape"
        }
      ]
    },
    {
      id: "face",
      label: "Face",
      subcategories: [
        {
          label: "Face Color",
          type: EditorType.color,
          key: "face.color"
        },
        {
          label: "Face Shape",
          type: EditorType.shape,
          key: "face.shape"
        }
      ]
    },
    {
      id: "mouth-eyes",
      label: "Mouth / Eyes",
      subcategories: [
        {
          label: "Eyes Shape",
          type: EditorType.shape,
          key: "eyes.shape"
        },
        {
          label: "Eyes Color",
          type: EditorType.color,
          key: "eyes.color"
        },
        {
          label: "Mouth Shape",
          type: EditorType.shape,
          key: "mouth.shape"
        }
      ]
    },
    {
      id: "body",
      label: "Body",
      subcategories: [
        {
          label: "Feet Color",
          type: EditorType.color,
          key: "feet.color"
        },
        {
          label: "Wrist Color",
          type: EditorType.color,
          key: "wrist.color"
        },
        {
          label: "Ankle Color",
          type: EditorType.color,
          key: "ankle.color"
        },
        {
          label: "Skin Color",
          type: EditorType.color,
          key: "skin.color"
        }
      ]
    }
  ];

  // select the first by default
  current = this.categories[0].id;
  type = EditorType;
  luchador: MainLuchador;
  subscription: Subscription;

  constructor(
    private nmsColor: NMSColor,
    private shapeConfig: ShapeConfig,
    private mediator: MaskEditorMediator
  ) {}

  ngOnInit() {
    console.log("mask editor detail luchador", this.luchador);
    this.subscription = this.mediator.luchador.subscribe( luchador => {
      this.luchador = luchador;
    })
  }

  ngOnDestroy(): void {
    if( this.subscription ){
      this.subscription.unsubscribe();
    }
  }

  setCurrent(id: string) {
    this.current = id;
    console.log("current", this.current);
  }

  isCurrent(id: string): boolean {
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

    this.onChange.next(this.luchador);
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
