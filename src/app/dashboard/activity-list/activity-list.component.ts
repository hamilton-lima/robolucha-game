import { Component, OnInit } from "@angular/core";
import { ModelActivity, DefaultService } from "src/app/sdk";
import { Router } from "@angular/router";
import { AlertService } from "src/app/shared/alert.service";

@Component({
  selector: "app-activity-list",
  templateUrl: "./activity-list.component.html",
  styleUrls: ["./activity-list.component.scss"],
})
export class ActivityListComponent implements OnInit {
  constructor(
    private api: DefaultService,
    private router: Router,
    private alert: AlertService
  ) {}

  activities: ModelActivity[] = [];

  ngOnInit() {
    this.listActivities();
  }

  listActivities() {
    this.api.dashboardActivityGet().subscribe((response) => {
      this.activities = response;
    });
  }

  create() {
    this.alert.info("Create activity under construction", "DISMISS");
  }
}
