import { Component, OnInit, OnDestroy } from "@angular/core";
import { WatchMatchService, WatchDetails } from "./watch-match.service";
import { MainLuchador } from "../sdk/model/models";
import { ActivatedRoute } from "@angular/router";
import { SharedStateService } from "../shared-state.service";
import { Subscription, Subject } from "rxjs";
import { MatchState, GameDefinition } from "./watch-match.model";

const MESSAGE_TIMEOUT = 3000;
const MAX_MESSAGES = 5;
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
  userMessage: any;
  messageList: Array<any>;
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
    this.messageList =[];
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
          let parsedMessage = JSON.parse(this.message);
          if(parsedMessage.type == "Match State") {
            this.matchState = parsedMessage.message;
            this.matchStateSubject.next(this.matchState);
          }
          else if (parsedMessage.type == "Message") {

            if (parsedMessage.message.luchadorID == this.luchador.id) {
              this.userMessage = parsedMessage.message;
              this.chooseBoxType();
            }
            this.processMessageList();
          }
        });
      }
    });

    this.service.connect();
  }

  private chooseBoxType() {
    switch (this.userMessage.type) {
      case "debug": {
        this.userMessage.boxType = "info";
        break;
      }
      case "say": {
        this.userMessage.boxType = "secondary";
        break;
      }
      case "warning": {
        this.userMessage.boxType = "warning";
        break;
      }
      case "danger": {
        this.userMessage.boxType = "danger";
        break;
      }
    }
  }

  private processMessageList() {
    this.cleanMessageList();

    let l = this.messageList.push(this.userMessage);
    //max is 5 elements, remove oldest
    if (l > MAX_MESSAGES) {
      this.messageList.splice(0, 1);
      l = this.messageList.length;
    }
    setTimeout(() => this.messageList[l - 1] = null, MESSAGE_TIMEOUT);
    setTimeout(() => this.cleanMessageList(), MESSAGE_TIMEOUT * 2);
  }

  private cleanMessageList() {
    //removing null elements
    for (let i = 0; i < this.messageList.length; i++) {
      if (!this.messageList[i]) {
        this.messageList.splice(i, 1);
      }
    }
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
  sortedScores(){
    return this.matchState.luchadores.sort(this.compareScores).reverse();
  }
  compareScores(a,b){
    if (a.state.score < b.state.score)
      return -1;
    if (a.state.score > b.state.score)
      return 1;
    return 0;
  }

  getUserMessages(){
    if (this.messageList){
      return this.messageList;
    }
    return [];
  }
}
