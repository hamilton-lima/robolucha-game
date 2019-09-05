import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  EventEmitter,
  Output
} from "@angular/core";
import { DefaultService, ModelClassroom } from "src/app/sdk";
import { MatSnackBar, MatDialog } from "@angular/material";
import { AlertService } from "../../alert.service";

@Component({
  selector: "app-join-classroom",
  templateUrl: "./join-classroom.component.html",
  styleUrls: ["./join-classroom.component.css"]
})
export class JoinClassroomComponent implements OnInit {
  @Output() onJoin = new EventEmitter<ModelClassroom>();

  code: string = "";
  classroom: ModelClassroom;

  constructor(private api: DefaultService, public alert: AlertService) {}

  ngOnInit() {}

  join() {
    console.log("join classroom", this.code);
    this.api
      .privateJoinClassroomAccessCodePost(this.code)
      .subscribe((classroom: ModelClassroom) => {
        console.log("joined", classroom);
        if (classroom == null) {
          this.alert.warning(
            "INVALID Code, please check with your teacher.",
            "CLOSE"
          );
        } else {
          this.onJoin.emit(classroom);
        }
      });
  }
}
