import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-big-button',
  templateUrl: './big-button.component.html',
  styleUrls: ['./big-button.component.scss']
})
export class BigButtonComponent implements OnInit {

  @Input() minWidth;
  @Input() disabled: boolean = false;
  innerColor = "primary";

  @Input("themeColor")
  set setInnerColor(color: string) {
    console.log("inner color updated", color);
    this.innerColor = color;
  }

  constructor() { }

  ngOnInit() {  }

}
