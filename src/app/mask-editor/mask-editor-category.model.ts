export enum EditorType {
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

export const maskEditorCategories: Array<CategoryOptions> = [
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
