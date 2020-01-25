import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DefaultService } from "src/app/sdk";
import { ModelGameComponent } from "src/app/sdk/model/mainGameComponent";
import { ShepherdNewService, ITourStep } from "src/app/shepherd-new.service";
import { EventsService } from "src/app/shared/events.service";
import { UserService } from "src/app/shared/user.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  luchador: ModelGameComponent;
  page: string;

  constructor(
    private router: Router,
    private api: DefaultService,
    private route: ActivatedRoute,
    private shepherd: ShepherdNewService,
    private events: EventsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.luchador = this.route.snapshot.data.luchador;
    this.page = this.route.snapshot.url.join("/");
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
    console.log("current user", this.userService.getUser());
    this.shepherd.show(this.steps);
  }

  customize() {
    this.events.click(this.page, "customize");
    this.router.navigate(["mask"]);
  }

  publicArena() {
    this.events.click(this.page, "public-arena");
    this.router.navigate(["public"]);
  }

  classroomArena() {
    this.events.click(this.page, "classroom-arena");
    this.router.navigate(["classroom"]);
  }

  dashboard() {
    this.events.click(this.page, "classroom-arena");
    this.router.navigate(["dashboard"]);
  }

  help() {
    this.events.click(this.page, "help");
    window.location.href = "http://docs.robolucha.com";
  }

  roundClick() {
    // console.log('click');
  }
}
