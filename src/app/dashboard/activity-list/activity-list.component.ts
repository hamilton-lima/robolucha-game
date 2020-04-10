import { Component, OnInit } from '@angular/core';
import { ModelActivity, DefaultService } from 'src/app/sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {

  constructor(private api: DefaultService, private router: Router) {}

  activities: ModelActivity[] = [];

  ngOnInit() {
    this.listActivities();
  }

  listActivities() {
    this.api.privateActivityGet().subscribe(response => {
      this.activities = response;
    });
  }

  create(){
    console.log("create, nothing to see here...");
  }

}
