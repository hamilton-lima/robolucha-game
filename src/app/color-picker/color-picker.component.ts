import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { NMSColor } from "./nmscolor";

@Component({
  selector: "app-color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: ["./color-picker.component.css"]
})
export class ColorPickerComponent implements OnInit {
  colors;

  @Output() onChange = new EventEmitter<string>();

  constructor() {
    this.colors = NMSColor.allColors;
    console.log("colors", this.colors);
  }

  ngOnInit() {}

  selectColor(color:string){
    this.onChange.next(color);
  }
}
