import { Component, OnInit } from "@angular/core";
import { DefaultService } from "src/app/sdk";
import { ModelClassroom } from "src/app/sdk/model/modelClassroom";
import { Router } from "@angular/router";
import { AlertService } from "src/app/shared/alert.service";

@Component({
  selector: "app-classroom-list",
  templateUrl: "./classroom-list.component.html",
  styleUrls: ["./classroom-list.component.scss"],
})
export class ClassroomListComponent implements OnInit {
  constructor(
    private api: DefaultService,
    private router: Router,
    private alert: AlertService
  ) {}

  classrooms: ModelClassroom[] = [];

  ngOnInit() {
    this.listClassrooms();
  }

  listClassrooms() {
    this.api.dashboardClassroomGet().subscribe((response) => {
      this.classrooms = response;
    });
  }

  create() {
    this.router.navigate(["/dashboard/classroom-create"]);
  }

  listStudents(id) {
    this.router.navigate(["/dashboard/classroom-students/", id]);
  }

  listAssignments(id) {
    this.alert.info("Assignments list is under construction", "DISMISS");
  }
}
