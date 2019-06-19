import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  ActivatedRoute
} from "@angular/router";
import { DefaultService, MainGameDefinition, MainGameComponent } from "../sdk";
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
    private router: Router,
    private api: DefaultService,
    private route: ActivatedRoute
  ) {}

  matchOver = false;

  matchID: number;
  luchador: MainGameComponent;
  gameDefinition: MainGameDefinition;
  readonly matchStateSubject = new Subject<MatchState>();
  readonly messageSubject = new Subject<Message>();
  scores: Score[] = [];

  scoreState: string = "out";
  codeState: string = "out";
  messageState: string = "out";
  panelStates = { score: "out", code: "out", message: "out" };

  @ViewChild(CodeEditorPanelComponent) codeEditor: CodeEditorPanelComponent;

  ngOnInit(): void {
    this.luchador = this.route.snapshot.data.luchador;
    this.matchID = Number.parseInt(this.route.snapshot.paramMap.get("id"));
    this.gameDefinition = null;
    
    console.log("match ID", this.matchID);
    console.log("luchador", this.luchador);

    this.api.privateMatchSingleGet(this.matchID).subscribe(match => {
      this.api
        .privateGameDefinitionIdIdGet(match.gameDefinitionID)
        .subscribe(gameDefinition => {
          this.gameDefinition = gameDefinition;
          console.log("gamedefinition", this.gameDefinition);
        });
    });

    this.matchStateSubject.subscribe((matchState: MatchState) => {
      this.scores = matchState.scores;
    });

  }

  endMatch() {
    this.matchOver = true;
  }

  gotoMatchList(){
    this.router.navigate(["play"]);
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
  }

  toggleCode() {
    this.panelStates.code = this.panelStates.code === "out" ? "in" : "out";
    this.panelStates.score = "out";
    this.panelStates.message = "out";
  }

  toggleMessages() {
    this.panelStates.message =
      this.panelStates.message === "out" ? "in" : "out";
    this.panelStates.score = "out";
    this.panelStates.code = "out";
  }

  updateState(state: MatchState) {
    this.matchStateSubject.next(state);
  }

  updateMessage(message: Message) {
    this.messageSubject.next(message);
  }

}
