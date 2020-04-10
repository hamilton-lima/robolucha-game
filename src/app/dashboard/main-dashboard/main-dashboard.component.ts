import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EventsService } from "src/app/shared/events.service";
import { MatDrawer } from "@angular/material";

@Component({
  selector: "app-main-dashboard",
  templateUrl: "./main-dashboard.component.html",
  styleUrls: ["./main-dashboard.component.scss"],
})
export class MainDashboardComponent implements OnInit {
  @ViewChild("sidenav") sidenav: MatDrawer;
  
  page: string;

  constructor(
    private router: Router,
    private events: EventsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.page = this.route.snapshot.url.join("/");
  }

  home() {
    this.events.click(this.page, "home");
    this.router.navigate(["home"]);
    this.sidenav.close();
  }

  classrooms() {
    this.events.click(this.page, "dashboard/classrooms");
    this.router.navigate(["dashboard/classrooms"]);
    this.sidenav.close();
  }

  activities() {
    this.events.click(this.page, "dashboard/activities");
    this.router.navigate(["dashboard/activities"]);
    this.sidenav.close();
  }
}
