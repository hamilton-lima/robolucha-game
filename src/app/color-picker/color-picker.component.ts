import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { NMSColor } from "./nmscolor";

@Component({
  selector: "app-color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: ["./color-picker.component.css"]
})
export class ColorPickerComponent implements OnInit {
  colors;

  @Input() current: string;
  @Output() onChange = new EventEmitter<string>();

  constructor(private nmsColors:NMSColor) {
    this.colors = nmsColors.allColors;
  }

  ngOnInit() {}

  selectColor(color:string){
    this.current = color;
    this.onChange.next(color);
  }

  isCurrent(color:string){
    return color === this.current;
  }
}
