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
      arenaWidth: 1200,
      arenaHeight: 600,
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
          this.matchState = JSON.parse(this.message);
          this.matchStateSubject.next(this.matchState);
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
