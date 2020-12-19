import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { DefaultService, ModelClassroom } from "src/app/sdk";
import { AlertService } from "src/app/shared/alert.service";

@Component({
  selector: "app-join-classroom",
  templateUrl: "./join-classroom.component.html",
  styleUrls: ["./join-classroom.component.css"],
})
export class JoinClassroomComponent implements OnInit {
  code: string = "";
  classroom: ModelClassroom;

  constructor(
    private api: DefaultService,
    public alert: AlertService,
    private dialogRef: MatDialogRef<JoinClassroomComponent>
  ) {}

  ngOnInit() {}

  join() {
    this.api
      .privateJoinClassroomAccessCodePost(this.code)
      .subscribe((classroom: ModelClassroom) => {
        if (classroom == null) {
          this.alert.warning(
            "INVALID Code, please check with your teacher.",
            "CLOSE"
          );
        } else {
          this.alert.info(
            "Hurray! You joinned classroom: " + classroom.name,
            "CLOSE"
          );
          this.dialogRef.close();
        }
      });
  }
}
