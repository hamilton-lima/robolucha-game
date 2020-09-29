import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  ActivatedRoute,
} from "@angular/router";
import {
  DefaultService,
  ModelGameDefinition,
  ModelGameComponent,
  ModelCode,
  ModelMatch,
} from "../sdk";
import { WatchMatchComponent } from "../watch-match/watch-match.component";
import { CanComponentDeactivate } from "../can-deactivate-guard.service";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { Subject } from "rxjs";
import { MatchState, Score } from "../watch-match/watch-match.model";
import { Message } from "../message/message.model";
import { CodeEditorPanelComponent } from "../code-editor-panel/code-editor-panel.component";
import { ShepherdNewService, ITourStep } from "../shepherd-new.service";
import { EventsService } from "../shared/events.service";
import { UserService } from "../shared/user.service";
import Shepherd from "shepherd.js";
import { AlertService } from "../pages/alert.service";

@Component({
  selector: "app-watch-page",
  templateUrl: "./watch-page.component.html",
  styleUrls: ["./watch-page.component.css"],
})
export class WatchPageComponent
  implements OnInit, CanComponentDeactivate, OnChanges {
  constructor(
    private api: DefaultService,
    private route: ActivatedRoute,
    private shepherd: ShepherdNewService,
    private events: EventsService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private alert: AlertService,
    private router: Router
  ) {}

  matchReady = false;
  matchFinished = false;
  matchOver = false;
  matchPreparing = false;
  matchOverTitle: string;

  displayScore = false;
  dirty = false;

  page: string;
  tour: Shepherd.Tour;

  matchID: number;
  luchador: ModelGameComponent;
  gameDefinition: ModelGameDefinition;
  readonly matchStateSubject = new Subject<MatchState>();
  readonly messageSubject = new Subject<Message>();
  scores: Score[] = [];

  codes = {
    onStart: <ModelCode>{ event: "onStart" },
    onRepeat: <ModelCode>{ event: "onRepeat" },
    onGotDamage: <ModelCode>{ event: "onGotDamage" },
    onFound: <ModelCode>{ event: "onFound" },
    onHitOther: <ModelCode>{ event: "onHitOther" },
    onHitWall: <ModelCode>{ event: "onHitWall" },
  };

  @ViewChild(CodeEditorPanelComponent) codeEditor: CodeEditorPanelComponent;

  readonly steps: ITourStep[] = [
    {
      title: "Know your luchador",
      text:
        '<img src="assets/help/luchador.jpg"><br>This is your luchador, you control them by writing instructions, know as CODE',
      attachTo: { element: "#selector-luchador", on: "top" },
    },
    {
      title: "Move to the green",
      text:
        "When in a tutorial your objective is move your character to the GREEN area",
      attachTo: { element: "#selector-green-area", on: "top" },
    },
    {
      title: "Editting some code",
      text: "Click here to edit your luchador code",
      attachTo: { element: "#button-edit-code", on: "top" },
      offset: "0 20px",
    },
    {
      title: "What is going on here?",
      text:
        "<strong>move(10)</strong> is your first instruction to your luchador,<br>" +
        '<strong>"move"</strong> is the action that your luchador will do <strong>10</strong>' +
        " is the intensity of the action",
      attachTo: { element: ".ace-content", on: "left" },
      offset: "0 20px",
    },
    {
      title: "Let's see some action",
      text: "click save to send the code to the luchador",
      attachTo: { element: "#button-code-editor-save", on: "top" },
      offset: "0 20px",
    },
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

  // possible states of a match
  onMatchNotReady: Subject<ModelMatch> = new Subject();
  onMatchRunning: Subject<ModelMatch> = new Subject();
  onMatchFinished: Subject<ModelMatch> = new Subject();

  ngOnInit(): void {
    this.page = this.route.snapshot.url.join("/");
    this.luchador = this.route.snapshot.data.luchador;

    this.matchID = Number.parseInt(this.route.snapshot.paramMap.get("id"));
    this.gameDefinition = null;

    this.onMatchRunning.subscribe((match) => {
      this.matchPreparing = false;
      this.matchReady = true;
      this.startMatch(match);
    });

    const self = this;
    this.onMatchNotReady.subscribe((match) => {
      this.matchPreparing = true;
      // try again in 5 seconds
      setTimeout(() => {
        self.tryToStartMatch();
      }, 2000);
    });

    this.onMatchFinished.subscribe((match) => {
      this.matchPreparing = false;
      this.matchFinished = true;

      console.log("finished", this.displayScore);

      this.api
        .privateGameDefinitionIdIdGet(match.gameDefinitionID)
        .subscribe((gameDefinition) => {
          this.defineMatchOverTitle(gameDefinition);
          this.endMatch();
        });
    });

    this.tryToStartMatch();

    this.matchStateSubject.subscribe((matchState: MatchState) => {
      this.scores = matchState.scores;
    });
  }

  tryToStartMatch() {
    this.api.privateMatchSingleGet(this.matchID).subscribe((match) => {
      // ready!
      if (match.status == "RUNNING") {
        this.onMatchRunning.next(match);
      }

      // trying to watch a match that is not ready
      if (match.status == "CREATED") {
        this.onMatchNotReady.next(match);
      }

      // trying to watch a match that already finished
      if (match.status == "FINISHED") {
        this.onMatchFinished.next(match);
      }

      // old matches without status should be considered finished
      if (match.status == "") {
        this.onMatchFinished.next(match);
      }
    });
  }

  defineMatchOverTitle(gameDefinition: ModelGameDefinition) {
    this.matchOverTitle = "Congratulations!";

    // only display score if is not tutorial
    if (gameDefinition.type !== "tutorial") {
      this.displayScore = true;
      this.matchOverTitle = "End of the Match";
    }
  }

  startMatch(match: ModelMatch) {
    this.api
      .privateGameDefinitionIdIdGet(match.gameDefinitionID)
      .subscribe((gameDefinition) => {
        this.gameDefinition = gameDefinition;
        this.refreshEditor();
        this.defineMatchOverTitle(gameDefinition);
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
    this.router.navigate(["home"]);
  }

  closeTour() {
    this.shepherd.done(this.tour);
  }

  canDeactivate() {
    if (this.dirty) {
      return window.confirm(
        "You have unsaved changes to your luchador code. Are you sure you want to leave?"
      );
    }
    return true;
  }

  updateState(state: MatchState) {
    this.matchStateSubject.next(state);
  }

  updateMessage(message: Message) {
    this.messageSubject.next(message);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refreshEditor();
    this.cdRef.detectChanges();
  }

  /** Loads codes from luchador to the editor, filter by gameDefinition */
  refreshEditor() {
    if (!this.gameDefinition) {
      console.warn("gameDefinition not set");
      return;
    }

    let loadedCodes = 0;
    this.dirty = false;

    for (var event in this.codes) {
      // get codes from luchador for event + gamedefinition
      let code = this.luchador.codes.find((code: ModelCode) => {
        return (
          code.event == event && code.gameDefinition == this.gameDefinition.id
        );
      });

      // if exists updates working codes
      if (code) {
        loadedCodes++;
        this.codes[event] = code;
      }
    }

    // no code found for current gamedefinition
    // apply suggested codes
    if (loadedCodes == 0) {
      for (var key in this.codes) {
        let suggestedCode = this.getCodeFromGameDefinition(key);
        this.codes[key] = suggestedCode;
      }

      this.dirty = true;
    }
  }

  // return suggested code from the current gamedefinition
  // if event not present in the list returns empy code
  getCodeFromGameDefinition(event: string): ModelCode {
    let result: ModelCode = this.gameDefinition.suggestedCodes.find(
      (element) => {
        return element.event == event;
      }
    );

    if (!result) {
      result = <ModelCode>{ event: event };
    }

    result.id = null;
    result.gameDefinition = this.gameDefinition.id;
    return result;
  }

  // update the internal list of codes from the editor
  updateCode(event: string, script: string) {
    // console.log("update code", event, script);
    this.dirty = true;
    this.codes[event].script = script;
  }

  save() {
    // apply the changes to the luchador object
    for (var event in this.codes) {
      // get codes from luchador for event + gamedefinition
      let code = this.luchador.codes.find((code: ModelCode) => {
        return (
          code.event == event &&
          code.gameDefinition == this.codes[event].gameDefinition
        );
      });

      // if exists updates the luchador with working code
      if (code) {
        code.script = this.codes[event].script;
      } else {
        this.luchador.codes.push(this.codes[event]);
      }
    }

    this.api.privateLuchadorPut(this.luchador).subscribe((response) => {
      this.alert.infoTop("Luchador updated", "DISMISS");
      this.dirty = false;
      this.cdRef.detectChanges();
    });
  }
}
