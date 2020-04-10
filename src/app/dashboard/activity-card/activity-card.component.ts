import { Component, OnInit, Input } from '@angular/core';
import { ModelActivity } from 'src/app/sdk';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss']
})
export class ActivityCardComponent implements OnInit {

  @Input() activity: ModelActivity;

  constructor() { }

  ngOnInit() {
  }

}
