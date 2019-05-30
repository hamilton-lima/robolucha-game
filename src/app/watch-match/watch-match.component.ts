import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  ViewChild
} from "@angular/core";
import { WatchMatchService, WatchDetails } from "./watch-match.service";
import {
  MainGameComponent,
  MainGameDefinition,
  MainMatch
} from "../sdk/model/models";
import { ActivatedRoute } from "@angular/router";
import { SharedStateService } from "../shared-state.service";
import { Subscription, Subject } from "rxjs";
import { MatchState, GameDefinition } from "./watch-match.model";
import { Message } from "../message/message.model";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { CanComponentDeactivate } from "../can-deactivate-guard.service";
import { CodeEditorPanelComponent } from "../code-editor-panel/code-editor-panel.component";

@Component({
  selector: "app-watch-match",
  templateUrl: "./watch-match.component.html",
  styleUrls: ["./watch-match.component.css"],
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
export class WatchMatchComponent
  implements OnInit, OnDestroy {
  @Input() gameDefinition: MainGameDefinition;
  @Input() luchador: MainGameComponent;
  @Input() matchID: number;

  @Output() matchFinished = new EventEmitter<boolean>();
  readonly matchStateSubject: Subject<MatchState>;
  readonly messageSubject: Subject<Message>;

  @ViewChild(CodeEditorPanelComponent) codeEditor: CodeEditorPanelComponent;

  message: string;
  userMessage: Message;
  matchState: MatchState;
  subscription: Subscription;
  onMessage: Subscription;

  matchOver: boolean;

  scoreState: string = "out";
  codeState: string = "out";
  messageState: string = "out";
  panelStates = { score: "out", code: "out", message: "out" };

  constructor(
    private route: ActivatedRoute,
    private service: WatchMatchService
  ) {
    this.luchador = {};
    this.message = "N/A";

    this.matchStateSubject = new Subject<MatchState>();
    this.messageSubject = new Subject<Message>();
  }

  ngOnInit() {
    this.subscription = this.service.ready.subscribe(() => {
      this.readyToStart();
    });

    console.log("watch match oninit", this.luchador);
    this.service.connect();
  }

  readyToStart() {
    const details: WatchDetails = {
      luchadorID: this.luchador.id,
      matchID: this.matchID
    };

    console.log("watch details", details);

    this.onMessage = this.service.watch(details).subscribe(message => {
      this.message = message;
      let parsedMessage = JSON.parse(this.message);
      parsedMessage.type = parsedMessage.type.toLowerCase();

      if (parsedMessage.type == "match-state") {
        this.matchState = parsedMessage.message;
        this.matchStateSubject.next(this.matchState);
        if (this.matchState.clock < 100) {
          this.matchOver = true;
          this.closeAllPanels();
        }
        return;
      }

      if (parsedMessage.type == "message") {
        this.userMessage = parsedMessage.message;
        this.messageSubject.next(this.userMessage);
        return;
      }
    });
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.onMessage) {
      this.onMessage.unsubscribe();
    }

    this.service.close();
  }

  toList(): void {
    this.matchFinished.emit(true);
  }

}
