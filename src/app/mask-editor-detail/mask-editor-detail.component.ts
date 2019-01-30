import { Component, OnInit } from "@angular/core";

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
  styleUrls: ["./mask-editor-detail.component.css"]
})
export class MaskEditorDetailComponent implements OnInit {
  current = Category.mask;
  options = Category;
  
  categories = [
    { label: "Mask", category: Category.mask },
    { label: "Mask Decoration", category: Category.maskDecoration },
    { label: "Face", category: Category.face },
    { label: "Mouth / Eyes", category: Category.mouthEyes },
    { label: "Body", category: Category.body }
  ];
  constructor() {}

  ngOnInit() {}

  setCurrent(category: Category) {
    this.current = category;
    console.log("current", this.current);
  }

  isCurrent(category: Category): boolean {
    return this.current === category;
  }
}
