import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AuthService } from "src/app/auth.service";
import {
  ModelClassroom,
  ModelUserDetails,
  ModelAvailableMatch,
  ModelMatch,
  DefaultService,
} from "src/app/sdk";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { LevelControlService } from "../level-control.service";

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
        .privateAvailableMatchClassroomIdGet(id)
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
      const classroom = this.classrooms[0];
      this.title = classroom.name;
    }
  }

  play(matchID: number) {
    this.api.privatePlayIdPost(matchID).subscribe((match: ModelMatch) => {
      this.router.navigate(["watch", match.id]);
    });
  }
}
