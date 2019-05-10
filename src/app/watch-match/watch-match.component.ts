import { Component, OnInit, OnDestroy } from "@angular/core";
import { WatchMatchService, WatchDetails } from "./watch-match.service";
import { MainLuchador } from "../sdk/model/models";
import { ActivatedRoute } from "@angular/router";
import { SharedStateService } from "../shared-state.service";
import { Subscription, Subject } from "rxjs";
import { MatchState, GameDefinition } from "./watch-match.model";
import { formatDate } from "@angular/common";
import { Message } from "../message/message.model";
import * as moment from 'moment';


@Component({
  selector: "app-watch-match",
  templateUrl: "./watch-match.component.html",
  styleUrls: ["./watch-match.component.css"]
})
export class WatchMatchComponent implements OnInit, OnDestroy {
  readonly gameDefinition: GameDefinition;
  readonly matchStateSubject: Subject<MatchState>;
  readonly messageSubject: Subject<Message>;

  luchador: MainLuchador;
  message: string;
  userMessage: Message;
  // messageList: Array<any>;
  matchState: MatchState;
  subscription: Subscription;
  onMessage: Subscription;

  constructor(
    private route: ActivatedRoute,
    private service: WatchMatchService,
    private shared: SharedStateService
  ) {
    this.luchador = {};
    this.message = "N/A";

    this.gameDefinition = {
      arenaWidth: 2400,
      arenaHeight: 1200,
      luchadorSize: 60,
      bulletSize: 16
    };

    this.matchStateSubject = new Subject<MatchState>();
    this.messageSubject = new Subject<Message>();
  }

  ngOnInit() {
    this.luchador = this.route.snapshot.data.luchador;
    // this.messageList =[];
    console.log("watch match oninit", this.luchador);

    this.subscription = this.service.ready.subscribe(() => {
      // console.log("on ready", this.shared.getCurrentMatch());

      if (this.shared.getCurrentMatch()) {
        const details: WatchDetails = {
          luchadorID: this.luchador.id,
          matchID: this.shared.getCurrentMatch().id
        };

        this.onMessage = this.service.watch(details).subscribe(message => {
          this.message = message;
          let parsedMessage = JSON.parse(this.message);
          parsedMessage.type = parsedMessage.type.toLowerCase();

          if (parsedMessage.type == "match-state") {
            this.matchState = parsedMessage.message;
            this.matchStateSubject.next(this.matchState);
          } else if (parsedMessage.type == "message") {
            if (parsedMessage.message.luchadorID == this.luchador.id) {
              this.userMessage = parsedMessage.message;
              this.messageSubject.next(this.userMessage);
              // this.processMessage();

            }
            // this.processMessageList();
          }
        });
      }
    });

    this.service.connect();
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

  parsedMatchTime(){
    let duration = moment.duration(this.matchState.clock);
    return this.formatDuration(duration);
  }

  formatDuration(duration):string{
    let min = duration.minutes();
    let sec = duration.seconds();
    if (min < 10) { 
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    return min + ":" + sec;
  }

}
