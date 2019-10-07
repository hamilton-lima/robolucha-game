import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DefaultService, ModelStudentResponse } from "src/app/sdk";

@Component({
  selector: "app-student-list",
  templateUrl: "./student-list.component.html",
  styleUrls: ["./student-list.component.scss"]
})
export class StudentListComponent implements OnInit {
  classroomID: number;
  students: ModelStudentResponse[] = [];
  displayedColumns = ["username", "actions"];

  constructor(private api: DefaultService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.classroomID = Number.parseInt(this.route.snapshot.paramMap.get("id"));
    this.api
      .dashboardClassroomStudentsIdGet(this.classroomID)
      .subscribe(response => {
        this.students = response;
      });
  }

  something(student: ModelStudentResponse){
    console.log("student", student);
  }
}
