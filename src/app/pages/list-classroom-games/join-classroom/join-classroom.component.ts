import { Component, OnInit, TemplateRef, ViewChild, EventEmitter, Output } from "@angular/core";
import { DefaultService, ModelClassroom } from "src/app/sdk";
import { MatSnackBar, MatDialog } from "@angular/material";

@Component({
  selector: "app-join-classroom",
  templateUrl: "./join-classroom.component.html",
  styleUrls: ["./join-classroom.component.css"]
})
export class JoinClassroomComponent implements OnInit {
  @Output() onJoin = new EventEmitter<ModelClassroom>();

  code: string = "";
  classroom: ModelClassroom;

  constructor(
    private api: DefaultService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  join() {
    console.log("join classroom", this.code);
    this.api
      .privateJoinClassroomAccessCodePost(this.code)
      .subscribe((classroom: ModelClassroom) => {
        console.log("joined", classroom);
        if (classroom == null) {
          this.snackBar.open(
            "INVALID Code, please check with your teacher.",
            "CLOSE",
            {
              duration: 5000
            }
          );
        } else {
          this.onJoin.emit(classroom);
        }
      });
  }
}
