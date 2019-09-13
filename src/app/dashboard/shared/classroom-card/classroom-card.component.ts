import { Component, OnInit, Input } from '@angular/core';
import { ModelClassroom } from 'src/app/sdk';

@Component({
  selector: 'app-classroom-card',
  templateUrl: './classroom-card.component.html',
  styleUrls: ['./classroom-card.component.scss']
})
export class ClassroomCardComponent implements OnInit {
  
  @Input() classroom: ModelClassroom;
  constructor() { }

  ngOnInit() {
  }

}
