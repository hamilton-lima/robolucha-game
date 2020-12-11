import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from "@angular/core";
import { WatchMatchService, WatchDetails } from "./watch-match.service";
import {
  ModelGameComponent,
  ModelGameDefinition,
  ModelMatch,
} from "../sdk/model/models";
import { ActivatedRoute } from "@angular/router";
import { SharedStateService } from "../shared-state.service";
import { Subscription, Subject } from "rxjs";
import { MatchState, GameDefinition, MatchEvent } from "./watch-match.model";
import { Message } from "../shared/message/message.model";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { CanComponentDeactivate } from "../can-deactivate-guard.service";
import { CodeEditorPanelComponent } from "../code-editor-panel/code-editor-panel.component";
import { ArenaComponent } from "../arena/arena.component";
import { CameraChange } from "../arena/camera3-d.service";

@Component({
  selector: "app-watch-match",
  templateUrl: "./watch-match.component.html",
  styleUrls: ["./watch-match.component.css"],
  providers: [WatchMatchService],
})
export class WatchMatchComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() gameDefinition: ModelGameDefinition;
  @Input() luchador: ModelGameComponent;
  @Input() matchID: number;
  @Input() inCameraChangeSubject: Subject<CameraChange>;

  @Output() matchFinished = new EventEmitter<boolean>();
  @Output() matchStateSubject = new EventEmitter<MatchState>();
  @Output() messageSubject = new EventEmitter<Message>();
  @Output() matchEventSubject = new EventEmitter<MatchEvent>();
  @Output() outCameraChangeSubject = new EventEmitter<CameraChange>();

  @ViewChild(ArenaComponent) arena: ArenaComponent;

  message: string;
  userMessage: Message;
  matchState: MatchState;
  subscription: Subscription;
  onMessage: Subscription;
  fps: Subject<number>;
  finished = false;

  constructor(private service: WatchMatchService) {
    this.luchador = {};
    this.message = "N/A";
    this.fps = service.fps;
  }

  ngOnInit() {
    this.readyToStart();
  }

  ngAfterViewInit(): void {
    this.arena.createScene();
  }

  readyToStart() {
    this.service.connect().subscribe((ready) => {
      console.log("watch-match connection to websocket", ready);

      const details: WatchDetails = {
        luchadorID: this.luchador.id,
        matchID: this.matchID,
      };

      this.onMessage = this.service.watch(details).subscribe((message) => {
        this.message = message;
        const parsed = JSON.parse(this.message);

        if (parsed.type == "match-state") {
          this.matchStateSubject.emit(parsed.message);

          if (!this.finished && parsed.message.clock < 0) {
            this.finished = true;
            this.matchFinished.emit(true);
          }
          return;
        }

        if (parsed.type == "message") {
          this.messageSubject.emit(parsed.message);
          return;
        }

        if (parsed.type == "event") {
          this.matchEventSubject.emit(parsed.message);
          return;
        }
      });

      this.inCameraChangeSubject.subscribe((cameraChange: CameraChange) => {
        this.outCameraChangeSubject.emit(cameraChange);
      });

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
