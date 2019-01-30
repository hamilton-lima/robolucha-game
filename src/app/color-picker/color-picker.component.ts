import { Component, OnInit } from "@angular/core";
import { NMSColor } from "./nmscolor";

@Component({
  selector: "app-color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: ["./color-picker.component.css"]
})
export class ColorPickerComponent implements OnInit {
  colors;

  constructor() {
    this.colors = NMSColor.allColors;
    console.log("colors", this.colors);
  }

  ngOnInit() {}
}
