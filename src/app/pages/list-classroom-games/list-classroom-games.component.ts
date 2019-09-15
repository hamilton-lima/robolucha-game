import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AuthService } from "src/app/auth.service";
import {
  ModelClassroom,
  ModelUserDetails,
  ModelAvailableMatch,
  ModelMatch,
  DefaultService
} from "src/app/sdk";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-classroom-games",
  templateUrl: "./list-classroom-games.component.html",
  styleUrls: ["./list-classroom-games.component.css"]
})
export class ListClassroomGamesComponent implements OnInit {
  @ViewChild("joinSucess") joinSucess: TemplateRef<any>;
  classroom: ModelClassroom;
  classrooms: ModelClassroom[] = [];
  matches: Array<ModelAvailableMatch> = [];
  title: string = "";

  constructor(
    private api: DefaultService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((userDetails: ModelUserDetails) => {
      this.classrooms = userDetails.classrooms;
      this.updateTitle();
      this.loadMatches();
    });
  }

  onJoin(classroom: ModelClassroom) {
    // // console.log("show dialog", this.joinSucess);
    this.classroom = classroom;
    this.dialog.open(this.joinSucess);
    this.authService.isLoggedIn().subscribe((userDetails: ModelUserDetails) => {
      this.classrooms = userDetails.classrooms;
      this.updateTitle();
      this.loadMatches();
    });
  }

  loadMatches() {
    if (this.classrooms.length > 0) {
      const id = this.classrooms[0].id;
      this.api
        .privateAvailableMatchClassroomIdGet(id)
        .subscribe((matches: Array<ModelAvailableMatch>) => {
          // // console.log("matches", matches);
          this.matches = matches;
        });
    }
  }

  updateTitle(){
    if( this.classrooms.length == 0 ){
      this.title = "Please join a classroom";
    } else {
      const classroom = this.classrooms[0];
      this.title = classroom.name;
    }
  }

  play(matchID: number) {
    // // console.log("play", matchID);
    this.api.privatePlayIdPost(matchID).subscribe((match: ModelMatch) => {
      // // console.log("joinned match", match);
      this.router.navigate(["watch", match.id]);
    });
  }
}
