import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShapeConfig } from './shape-config';

@Component({
  selector: 'app-shape-picker', 
  templateUrl: './shape-picker.component.html',
  styleUrls: ['./shape-picker.component.css']
})
export class ShapePickerComponent implements OnInit {

  @Input() current: string;
  @Input() shapeName: string;
  @Output() onChange = new EventEmitter<string>();

  constructor(private shapeConfig: ShapeConfig) { }

  ngOnInit() {
  }

  getImages(): Array<string>{
    let result = this.shapeConfig.images[this.shapeName];
    return result;
  }

  getImageSrc(image:string){
    return this.shapeConfig.path + image;
  }

  selectShape(shape:string){
    this.current = shape;
    this.onChange.next(shape);
  }

  isCurrent(shape:string){
    return shape === this.current;
  }

}
