import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  ActivatedRoute
} from "@angular/router";
import {
  DefaultService,
  ModelGameDefinition,
  ModelGameComponent
} from "../sdk";
import { WatchMatchComponent } from "../watch-match/watch-match.component";
import { CanComponentDeactivate } from "../can-deactivate-guard.service";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { Subject } from "rxjs";
import { MatchState, Score } from "../watch-match/watch-match.model";
import { Message } from "../message/message.model";
import { CodeEditorPanelComponent } from "../code-editor-panel/code-editor-panel.component";
import { ShepherdNewService, ITourStep } from "../shepherd-new.service";
import { EventsService } from "../shared/events.service";
import { UserService } from "../shared/user.service";
import Shepherd from "shepherd.js";

@Component({
  selector: "app-watch-page",
  templateUrl: "./watch-page.component.html",
  styleUrls: ["./watch-page.component.css"],
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translate3d({{inVal}}, 0, 0)"
        }),
        { params: { inVal: 0 } }
      ),
      state(
        "out",
        style({
          transform: "translate3d({{outVal}}, 0, 0)"
        }),
        { params: { outVal: "100%" } }
      ),
      transition("in => out", animate("400ms ease-in-out")),
      transition("out => in", animate("400ms ease-in-out"))
    ]),
    trigger("slideInOutVert", [
      state(
        "in",
        style({
          transform: "translate3d(0, {{inVal}}, 0)"
        }),
        { params: { inVal: 0 } }
      ),
      state(
        "out",
        style({
          transform: "translate3d(0, {{outVal}}, 0)"
        }),
        { params: { outVal: "100%" } }
      ),
      transition("in => out", animate("400ms ease-in-out")),
      transition("out => in", animate("400ms ease-in-out"))
    ])
  ]
})
export class WatchPageComponent implements OnInit, CanComponentDeactivate {
  constructor(
    private api: DefaultService,
    private route: ActivatedRoute,
    private shepherd: ShepherdNewService,
    private events: EventsService,
    private userService: UserService
  ) {}

  matchOver = false;
  displayScore = false;
  page: string;
  tour: Shepherd.Tour;

  matchID: number;
  luchador: ModelGameComponent;
  gameDefinition: ModelGameDefinition;
  readonly matchStateSubject = new Subject<MatchState>();
  readonly messageSubject = new Subject<Message>();
  scores: Score[] = [];

  scoreState: string = "out";
  codeState: string = "out";
  messageState: string = "out";
  panelStates = { score: "out", code: "out", message: "out" };

  @ViewChild(CodeEditorPanelComponent) codeEditor: CodeEditorPanelComponent;

  readonly steps: ITourStep[] = [
    {
      title: "Know your luchador",
      text:
        '<img src="assets/help/luchador.jpg"><br>This is your luchador, you control them by writing instructions, know as CODE',
      attachTo: { element: "#selector-luchador", on: "top" }
    },
    {
      title: "Move to the green",
      text:
        "When in a tutorial your objective is move your character to the GREEN area",
      attachTo: { element: "#selector-green-area", on: "top" }
    },
    {
      title: "Editting some code",
      text: "Click here to edit your luchador code",
      attachTo: { element: "#button-edit-code", on: "top" },
      offset: "0 20px"
    },
    {
      title: "What is going on here?",
      text:
        "<strong>move(10)</strong> is your first instruction to your luchador,<br>" +
        '<strong>"move"</strong> is the action that your luchador will do <strong>10</strong>' +
        " is the intensity of the action",
      attachTo: { element: ".ace-content", on: "left" },
      offset: "0 20px"
    },
    {
      title: "Let's see some action",
      text: "click save to send the code to the luchador",
      attachTo: { element: "#button-code-editor-save", on: "top" },
      offset: "0 20px"
    }
  ];

  ngAfterViewInit() {
    console.log("after view init");
    const user = this.userService.getUser();

    if (!user.settings.playedTutorial) {
      user.settings.playedTutorial = true;
      this.userService.updateSettings(user.settings);
      this.tour = this.shepherd.show(this.steps);
    }
  }

  ngOnInit(): void {
    this.page = this.route.snapshot.url.join("/");
    this.luchador = this.route.snapshot.data.luchador;
    this.matchID = Number.parseInt(this.route.snapshot.paramMap.get("id"));
    this.gameDefinition = null;

    this.api.privateMatchSingleGet(this.matchID).subscribe(match => {
      this.api
        .privateGameDefinitionIdIdGet(match.gameDefinitionID)
        .subscribe(gameDefinition => {
          this.gameDefinition = gameDefinition;
          
          // only display score if is not tutorial
          if( gameDefinition.type !== "tutorial"){
            this.displayScore = true;
          }
        });
    });

    this.matchStateSubject.subscribe((matchState: MatchState) => {
      this.scores = matchState.scores;
    });
  }

  endMatch() {
    this.matchOver = true;
  }

  goBack() {
    this.events.click(this.page, "match-is-over-goback");
    window.history.back();
  }

  goHome() {
    this.events.click(this.page, "home");
  }

  closeTour() {
    this.shepherd.done(this.tour);
  }

  canDeactivate() {
    if (this.codeEditor.dirty) {
      return window.confirm(
        "You have unsaved changes to your luchador code. Are you sure you want to leave?"
      );
    }
    return true;
  }

  closeAllPanels() {
    this.panelStates.score = "out";
    this.panelStates.code = "out";
    this.panelStates.message = "out";
  }

  toggleScore() {
    this.panelStates.score = this.panelStates.score === "out" ? "in" : "out";
    this.panelStates.code = "out";
    this.panelStates.message = "out";

    if (this.panelStates.score == "in") {
      this.events.click(this.page, "score.show");
    } else {
      this.events.click(this.page, "score.hide");
    }
  }

  toggleCode() {
    this.panelStates.code = this.panelStates.code === "out" ? "in" : "out";
    this.panelStates.score = "out";
    this.panelStates.message = "out";

    if (this.panelStates.score == "in") {
      this.events.click(this.page, "code.show");
    } else {
      this.events.click(this.page, "code.hide");
    }
  }

  toggleMessages() {
    this.panelStates.message =
      this.panelStates.message === "out" ? "in" : "out";
    this.panelStates.score = "out";
    this.panelStates.code = "out";

    if (this.panelStates.score == "in") {
      this.events.click(this.page, "messages.show");
    } else {
      this.events.click(this.page, "messages.hide");
    }
  }

  updateState(state: MatchState) {
    this.matchStateSubject.next(state);
  }

  updateMessage(message: Message) {
    this.messageSubject.next(message);
  }

  onCodeSave() {
    this.panelStates.code = "out";
    this.panelStates.score = "out";
    this.panelStates.message = "out";
    this.events.click(this.page, "code.save");
  }
}
