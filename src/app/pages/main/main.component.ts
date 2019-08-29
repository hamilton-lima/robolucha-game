import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DefaultService } from "src/app/sdk";
import { ModelGameComponent } from "src/app/sdk/model/mainGameComponent";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  luchador: ModelGameComponent;

  constructor(
    private router: Router,
    private api: DefaultService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.luchador = this.route.snapshot.data.luchador;
  }

  customize() {
    this.router.navigate(["mask"]);
  }

  publicArena() {
    this.router.navigate(["public"]);
  }

  classroomArena() {
    this.router.navigate(["classroom"]);
  }

  help() {
    window.location.href = "http://docs.robolucha.com";
  }
}
