import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges
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
import { ArenaComponent } from "../arena/arena.component";

@Component({
  selector: "app-watch-match",
  templateUrl: "./watch-match.component.html",
  styleUrls: ["./watch-match.component.css"]
})
export class WatchMatchComponent implements OnInit, OnDestroy, OnChanges {
  @Input() gameDefinition: MainGameDefinition;
  @Input() luchador: MainGameComponent;
  @Input() matchID: number;

  @Output() matchFinished = new EventEmitter<boolean>();
  @Output() matchStateSubject = new EventEmitter<MatchState>();
  @Output() messageSubject = new EventEmitter<Message>();

  @ViewChild(ArenaComponent) arena: ArenaComponent;

  message: string;
  userMessage: Message;
  matchState: MatchState;
  subscription: Subscription;
  onMessage: Subscription;
  ;

  constructor(private service: WatchMatchService) {
    this.luchador = {};
    this.message = "N/A";
  }

  ngOnInit() {
    // this.releaseConnection();

    this.subscription = this.service.ready.subscribe(() => {
      this.readyToStart();
    });

    console.log("watch match oninit", this.luchador);
    this.service.connect();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes", changes.matchID);
    if (changes.matchID && !changes.matchID.firstChange) {
      this.readyToStart();
      this.arena.createScene();
    }
  }

  readyToStart() {
    const details: WatchDetails = {
      luchadorID: this.luchador.id,
      matchID: this.matchID
    };

    console.log("watch details", details);

    this.onMessage = this.service.watch(details).subscribe(message => {
      this.message = message;
      const parsed = JSON.parse(this.message);
      // parsedMessage.type = parsedMessage.type.toLowerCase();

      if (parsed.type == "match-state") {
        this.matchStateSubject.emit(parsed.message);

        if (parsed.message.clock < 0) {
          this.matchFinished.emit(true);
        }
        return;
      }

      if (parsed.type == "message") {
        this.messageSubject.emit(parsed.message);
        return;
      }
    });
  }

  ngOnDestroy(): void {
    this.releaseConnection();
  }

  releaseConnection() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.onMessage) {
      this.onMessage.unsubscribe();
    }

    if (this.service) {
      this.service.close();
    }
  }

  toList(): void {
    this.matchFinished.emit(true);
  }
}
