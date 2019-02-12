import { Component, OnInit, OnDestroy } from "@angular/core";
import { WatchMatchService, WatchDetails } from "./watch-match.service";
import { MainLuchador } from "../sdk/model/models";
import { ActivatedRoute } from "@angular/router";
import { SharedStateService } from "../shared-state.service";
import { Subscription, Subject } from "rxjs";
import { MatchState, GameDefinition } from "./watch-match.model";

@Component({
  selector: "app-watch-match",
  templateUrl: "./watch-match.component.html",
  styleUrls: ["./watch-match.component.css"]
})
export class WatchMatchComponent implements OnInit, OnDestroy {
  readonly gameDefinition: GameDefinition;
  readonly matchStateSubject: Subject<MatchState>;

  luchador: MainLuchador;
  message: string;
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
  }

  ngOnInit() {
    this.luchador = this.route.snapshot.data.luchador;
    console.log("watch match oninit", this.luchador);

    this.subscription = this.service.ready.subscribe(() => {
      console.log("on ready", this.shared.getCurrentMatch());

      // TODO: add event to do this
      if (this.shared.getCurrentMatch()) {
        const details: WatchDetails = {
          luchadorID: this.luchador.id,
          matchID: this.shared.getCurrentMatch().id
        };
        console.log("watch details", details);
        this.onMessage = this.service.watch(details).subscribe(message => {
          this.message = message;
          const matchStateCandidate: MatchState = JSON.parse(this.message);

          // TODO: replace this by the proper message type from the publisher
          if( matchStateCandidate.clock ){
            this.matchState = matchStateCandidate;
            this.matchStateSubject.next(this.matchState);
          } else { 
            console.log("other event", this.message);
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
}
