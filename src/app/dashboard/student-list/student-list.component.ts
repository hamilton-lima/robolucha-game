import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DefaultService } from "src/app/sdk";
import { ModelStudentResponse } from "src/app/sdk/model/modelStudentResponse";
import { AlertService } from "src/app/shared/alert.service";

@Component({
  selector: "app-student-list",
  templateUrl: "./student-list.component.html",
  styleUrls: ["./student-list.component.scss"],
})
export class StudentListComponent implements OnInit {
  classroomID: number;
  students: ModelStudentResponse[] = [];
  displayedColumns = ["username", "actions"];

  constructor(
    private api: DefaultService,
    private route: ActivatedRoute,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.classroomID = Number.parseInt(this.route.snapshot.paramMap.get("id"));
    this.api
      .dashboardClassroomStudentsIdGet(this.classroomID)
      .subscribe((response) => {
        this.students = response;
      });
  }

  something(student: ModelStudentResponse) {
    this.alert.info("Student actions under development", "DISMISS");
  }
}
