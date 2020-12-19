import { Component, Input, OnInit } from '@angular/core';
import { BoxMenuItem } from '../box-menu/box-menu.component';

@Component({
  selector: 'app-box-menu-item',
  templateUrl: './box-menu-item.component.html',
  styleUrls: ['./box-menu-item.component.scss']
})
export class BoxMenuItemComponent implements OnInit {
  @Input() item: BoxMenuItem;
  constructor() { }

  ngOnInit() {
  }

}
