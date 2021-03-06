import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AuthService } from "src/app/auth.service";
import {
  ModelClassroom,
  ModelUserDetails,
  ModelMatch,
  DefaultService,
  ModelPlayRequest,
} from "src/app/sdk";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { LevelControlService } from "src/app/shared/level-control.service";
import { ModelAvailableMatch } from "src/app/sdk/model/modelAvailableMatch";

@Component({
  selector: "app-list-classroom-games",
  templateUrl: "./list-classroom-games.component.html",
  styleUrls: ["./list-classroom-games.component.css"],
})
export class ListClassroomGamesComponent implements OnInit {
  @ViewChild("joinSucess") joinSucess: TemplateRef<any>;
  classroom: ModelClassroom;
  classrooms: ModelClassroom[] = [];
  matches: Array<ModelAvailableMatch> = [];
  title: string = "";
  userDetails: ModelUserDetails;

  constructor(
    private api: DefaultService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private level: LevelControlService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((userDetails: ModelUserDetails) => {
      this.userDetails = userDetails;
      this.classrooms = userDetails.classrooms;
      this.updateTitle();
      this.loadMatches(userDetails);
    });
  }

  onJoin(classroom: ModelClassroom) {
    // // console.log("show dialog", this.joinSucess);
    this.classroom = classroom;
    this.dialog.open(this.joinSucess);
    this.authService.isLoggedIn().subscribe((userDetails: ModelUserDetails) => {
      this.userDetails = userDetails;
      this.classrooms = userDetails.classrooms;
      this.updateTitle();
      this.loadMatches(userDetails);
    });
  }

  loadMatches(userDetails: ModelUserDetails) {
    if (this.classrooms.length > 0) {
      const id = this.classrooms[0].id;
      this.api
        .privateAvailableMatchClassroomJoinedGet()
        .subscribe((matches: Array<ModelAvailableMatch>) => {
          this.matches = matches.filter((match) =>
            this.level.showAvailableMatch(userDetails, match.gameDefinition)
          );
        });
    }
  }

  updateTitle() {
    if (this.classrooms.length == 0) {
      this.title = "Please join a classroom";
    } else {
      this.title =
        "Maps for the classrooms: " +
        this.classrooms.map((classroom) => classroom.name).join(",");
    }
  }

  play(matchID: number) {
    const playRequest = <ModelPlayRequest>{
      availableMatchID: matchID,
      teamID: 0,
    };

    this.api.privatePlayPost(playRequest).subscribe((match: ModelMatch) => {
      this.router.navigate(["watch", match.id]);
    });
  }
}
