import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShapeConfig } from './shape-config';

@Component({
  selector: 'app-shape-picker', 
  templateUrl: './shape-picker.component.html',
  styleUrls: ['./shape-picker.component.css']
})
export class ShapePickerComponent implements OnInit {

  @Input() shapeName: string;
  @Output() onChange = new EventEmitter<string>();

  constructor(private shapeConfig: ShapeConfig) { }

  ngOnInit() {
  }

  getImages(): Array<string>{
    let result = this.shapeConfig[this.shapeName];
    return result;
  }

  getImageSrc(image:string){
    return this.shapeConfig.path + image;
  }

  selectShape(shape:string){
    this.onChange.next(shape);
  }

}
