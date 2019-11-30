import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DefaultService } from "src/app/sdk";
import { ModelGameComponent } from "src/app/sdk/model/mainGameComponent";
import { ShepherdNewService, ITourStep } from "src/app/shepherd-new.service";

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
    private route: ActivatedRoute,
    private shepherd: ShepherdNewService
  ) {}

  ngOnInit() {
    this.luchador = this.route.snapshot.data.luchador;
  }

  readonly steps: ITourStep[] = [
    {
      title: "Your luchador name",
      text: "We created a new name for your luchador",
      attachTo: { element: "#luchador-name", on: "bottom" },
      offset: "0 20px"
    },
    {
      title: "Change your mask",
      text: "Use this option to change how your mask look",
      attachTo: { element: "#customize-button", on: "top" }
    },
    {
      title: "Play on-line",
      text: "Play here!",
      attachTo: { element: "#public-arena-button", on: "top" }
    }
  ];

  ngAfterViewInit() {
    this.shepherd.show(this.steps);
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

  roundClick() {
    // console.log('click');
  }
}
