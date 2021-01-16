import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  OnDestroy,
  EventEmitter,
  Output,
  HostListener,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  DefaultService,
  ModelGameDefinition,
  ModelGameComponent,
  ModelCode,
  ModelMatch,
} from "../sdk";
import { CanComponentDeactivate } from "../can-deactivate-guard.service";
import { Subject, Subscription } from "rxjs";
import { MatchState, Score } from "../watch-match/watch-match.model";
import { Message } from "../shared/message/message.model";
import { ShepherdNewService, ITourStep } from "../shepherd-new.service";
import { EventsService } from "../shared/events.service";
import { UserService } from "../shared/user.service";
import Shepherd from "shepherd.js";
import { AlertService } from "src/app/shared/alert.service";
import {
  WatchDetails,
  WatchMatchService,
} from "../watch-match/watch-match.service";
import { MatchReady } from "./watch-page.model";
import { CameraChange } from "../arena/camera3-d.service";
import { CodeEditorEvent } from "../shared/code-editor/code-editor.component";
import { NarrativeDialogService } from "./narrative/narrative-dialog.service";
import { BlocklyConfig } from "../shared/code-blockly/code-blockly.service";
import {
  CodeEditorService,
  ALL,
} from "../shared/code-editor/code-editor.service";

@Component({
  selector: "app-watch-page",
  templateUrl: "./watch-page.component.html",
  styleUrls: ["./watch-page.component.css"],
  providers: [WatchMatchService],
})
export class WatchPageComponent
  implements OnInit, CanComponentDeactivate, OnChanges, OnDestroy {
  @Output() cameraChangeSubject = new EventEmitter<CameraChange>();

  constructor(
    private api: DefaultService,
    private route: ActivatedRoute,
    private shepherd: ShepherdNewService,
    private events: EventsService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private alert: AlertService,
    private router: Router,
    private watchService: WatchMatchService,
    private narrative: NarrativeDialogService,
    private service: CodeEditorService
  ) {}

  matchReady = false;
  notReadyMessage = "";
  matchLinkInvalid = false;
  matchOver = false;
  leftPage = false;

  matchNotReadyInfo: MatchReady;

  matchPreparing = false;
  matchOverTitle: string;

  displayScore = false;
  dirty = false;

  page: string;
  tour: Shepherd.Tour;

  currentCamera: number = 0;

  matchID: number;
  luchador: ModelGameComponent;
  gameDefinition: ModelGameDefinition;
  useOther = BlocklyConfig.DefaultWithOther;

  readonly matchStateSubject = new Subject<MatchState>();
  readonly messageSubject = new Subject<Message>();
  scores: Score[] = [];

  code: ModelCode;
  script: string;

  readonly steps: ITourStep[] = [
    {
      title: "YOU ARE THE BOSS!",
      text:
        "Try some commands here, MOVE for example<br>" +
        '<img src="assets/help/move10.gif">',
      attachTo: { element: "#mat-expansion-panel-header-1", on: "left" },
    },
    {
      title: "Let's see some action",
      text: "Then click GO! to send the orders to your luchador robot",
      attachTo: { element: "#go-watchpage", on: "top" },
      offset: "0 20px",
    },
  ];

  // possible states of a match
  onMatchNotReady: Subject<ModelMatch> = new Subject();
  onMatchRunning: Subject<ModelMatch> = new Subject();
  onMatchFinished: Subject<ModelMatch> = new Subject();
  watchSubscription: Subscription;

  ngOnInit(): void {
    this.page = this.route.snapshot.url.join("/");
    this.luchador = this.route.snapshot.data.luchador;
    this.gameDefinition = this.route.snapshot.data.gameDefinition;
    this.narrative.onStart(this.gameDefinition.narrativeDefinitions);

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

      if (this.watchSubscription && !this.watchSubscription.closed) {
        return;
      }

      // wait for the connection
      this.watchService.connect().subscribe((ready) => {
        const details: WatchDetails = {
          luchadorID: this.luchador.id,
          matchID: this.matchID,
        };

        // wait for server notifications about the match state
        this.watchSubscription = this.watchService
          .watch(details)
          .subscribe((message) => {
            const parsed = JSON.parse(message);

            // ready to go, the server started to send state
            if (parsed.type == "match-state") {
              this.watchService.close();
              this.watchSubscription.unsubscribe();
              self.tryToStartMatch();
            }

            // to get structure and build model of the message
            if (parsed.type == "match-created") {
              this.setMatchNotReadyInfo(parsed.message);

              // we are ready close websocket connection and try to start the match
              if (this.matchNotReadyInfo.ready) {
                this.watchService.close();
                this.watchSubscription.unsubscribe();
                self.tryToStartMatch();
              }
            }
          });
      });
    });

    this.onMatchFinished.subscribe((match) => {
      this.matchPreparing = false;
      this.matchOver = false;
      this.matchLinkInvalid = true;

      this.api
        .privateGameDefinitionIdIdGet(match.gameDefinitionID)
        .subscribe((gameDefinition) => {
          this.defineMatchOverTitle(gameDefinition);
        });
    });

    this.tryToStartMatch();

    this.matchStateSubject.subscribe((matchState: MatchState) => {
      this.scores = matchState.scores;
    });
  }

  // data example
  // { "ready": false, "matchID": 118,
  //   "minParticipants": 1, "maxParticipants": 10,
  //   "participants": 1,
  //   "teamParticipants": [
  //     { "teamID": 3, "minParticipants": 2, "maxParticipants": 5, "participants": 1 }
  //   ] }
  setMatchNotReadyInfo(info: MatchReady) {
    this.matchNotReadyInfo = info;
    if (info.ready) {
      this.notReadyMessage = "Go go go";
    } else {
      // the match HAS team participants information
      if (info.teamParticipants && info.teamParticipants.length > 0) {
        this.notReadyMessage = "Waiting for more participants";
      } else {
        this.notReadyMessage = "Assembling all the pieces";
      }
    }
  }

  ngOnDestroy(): void {
    if (this.watchService) {
      this.watchService.close();
    }
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

  displayMatchOver() {
    if (
      this.gameDefinition.type == "tutorial" &&
      (this.narrative.hasOnEnd(this.gameDefinition.narrativeDefinitions) ||
        this.gameDefinition.nextGamedefinitionID)
    ) {
      return false;
    }

    return true;
  }

  startMatch(match: ModelMatch) {
    this.api
      .privateGameDefinitionIdIdGet(match.gameDefinitionID)
      .subscribe((gameDefinition) => {
        this.gameDefinition = gameDefinition;
        this.showHelp();
        this.refreshEditor();
        this.defineMatchOverTitle(gameDefinition);
      });
  }

  endMatch() {
    this.matchOver = true;
    if (!this.displayScore && !this.leftPage) {
      this.narrative.onEnd(this.gameDefinition);
    }
  }

  goBack() {
    this.leftPage = true;
    this.events.click(this.page, "match-is-over-goback");
    this.router.navigate(["home"]);
  }

  goHome() {
    this.leftPage = true;
    this.events.click(this.page, "home");
    this.router.navigate(["home"]);
  }

  cameras = new Map([
    [0, CameraChange.Tower],
    [1, CameraChange.ThirdPerson],
    [2, CameraChange.FirstPerson],
    [3, CameraChange.Crazy],
  ]);

  changeCamera() {
    this.currentCamera++;
    if (this.currentCamera > 3) {
      this.currentCamera = 0;
    }
    this.cameraChangeSubject.emit(this.cameras.get(this.currentCamera));
  }

  @HostListener("window:keydown", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if (event.code == "KeyC") {
      this.changeCamera();
    }
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

  showHelp() {
    const user = this.userService.getUser();

    if (!user.settings.playedTutorial) {
      user.settings.playedTutorial = true;
      this.userService.updateSettings(user.settings);
      this.tour = this.shepherd.show(this.steps);
    }
  }

  /** Loads codes from luchador to the editor, filter by gameDefinition */
  refreshEditor() {
    if (!this.gameDefinition) {
      return;
    }

    console.log("gamedefinition on refresh editor", this.gameDefinition.id);
    this.dirty = false;
    // get the luchador code for a single gamedefinition
    const codes = this.luchador.codes.filter((code: ModelCode) => {
      return code.gameDefinition == this.gameDefinition.id;
    });

    // only event==all
    const code = this.service.getCode(codes, this.gameDefinition.id);

    // if exists updates code
    if (code.id) {
      this.code = code;
      this.script = this.code.script;

    } else {
      // no code found for current gamedefinition
      // apply suggested codes
      const suggestedCode = this.service.getCode(
        this.gameDefinition.suggestedCodes
      );
      suggestedCode.gameDefinition = this.gameDefinition.id;
      this.code = suggestedCode;
      this.script = this.code.script;
      this.dirty = true;
    }
  }

  updateCode(event: CodeEditorEvent) {
    this.dirty = true;
    this.code.blockly = event.blocklyDefinition;
    this.code.script = event.code;
    this.script = this.code.script;
    this.cdRef.detectChanges();
  }

  save(event) {
    console.log("event ", event, typeof event )
    event.stopPropagation();
    // get codes from luchador + gamedefinition
    let code = this.luchador.codes.find((code: ModelCode) => {
      return (
        code.event == ALL && code.gameDefinition == this.code.gameDefinition
      );
    });

    // if exists updates the luchador with working code
    if (code) {
      code.script = this.code.script;
      code.blockly = this.code.blockly;
    } else {
      this.luchador.codes.push(this.code);
    }

    this.api.privateLuchadorPut(this.luchador).subscribe((response) => {
      this.alert.infoTop("Luchador updated", "CLOSE");
      this.dirty = false;
      this.cdRef.detectChanges();
    });
  }

}
