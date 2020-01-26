import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DefaultService } from "src/app/sdk";
import { ModelGameComponent } from "src/app/sdk/model/mainGameComponent";
import { ShepherdNewService, ITourStep } from "src/app/shepherd-new.service";
import { EventsService } from "src/app/shared/events.service";
import { UserService } from "src/app/shared/user.service";
import Shepherd from "shepherd.js";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  luchador: ModelGameComponent;
  page: string;
  tour: Shepherd.Tour;

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
      title: "Play on-line",
      text: "Play here!",
      attachTo: { element: "#public-arena-button", on: "top" }
    },
    {
      title: "Customize your character",
      text: "Use this option to change how your mask look like",
      attachTo: { element: "#customize-button", on: "top" }
    },
    {
      title: "Your luchador name",
      text: "We created a new name for your character",
      attachTo: { element: "#luchador-name", on: "bottom" },
      offset: "0 20px"
    }
  ];

  ngAfterViewInit() {
    const user = this.userService.getUser();

    if (!user.settings.visitedMainPage) {
      user.settings.visitedMainPage = true;
      this.userService.updateSettings(user.settings);
      this.tour = this.shepherd.show(this.steps);
    }
  }

  customize() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "customize");
    this.router.navigate(["mask"]);
  }

  publicArena() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "public-arena");
    this.router.navigate(["public"]);
  }

  classroomArena() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "classroom-arena");
    this.router.navigate(["classroom"]);
  }

  dashboard() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "classroom-arena");
    this.router.navigate(["dashboard"]);
  }

  help() {
    this.shepherd.done(this.tour);
    this.events.click(this.page, "help");
    this.router.navigate(["help"]);
  }

  roundClick() {
    // console.log('click');
  }
}
