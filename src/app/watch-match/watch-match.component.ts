import { Component, OnInit, OnDestroy } from "@angular/core";
import { WatchMatchService, WatchDetails } from "./watch-match.service";
import { MainLuchador } from "../sdk/model/models";
import { ActivatedRoute } from "@angular/router";
import { SharedStateService } from "../shared-state.service";
import { Subscription, Subject } from "rxjs";
import { MatchState, GameDefinition } from "./watch-match.model";
import { Message } from "../message/message.model";
import { trigger, state, style, transition, animate} from '@angular/animations';


@Component({
  selector: "app-watch-match",
  templateUrl: "./watch-match.component.html",
  styleUrls: ["./watch-match.component.css"],
  animations: [
    trigger('slideInOut', [
      
      state('in', style({
        transform: 'translate3d({{inVal}}, 0, 0)'
      }), {params: {inVal:0}}),
      state('out', style({
        transform: 'translate3d({{outVal}}, 0, 0)'
      }), {params:{outVal:'100%'}}),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
    trigger('slideInOutVert', [
      
      state('in', style({
        transform: 'translate3d(0, {{inVal}}, 0)'
      }), {params: {inVal:0}}),
      state('out', style({
        transform: 'translate3d(0, {{outVal}}, 0)'
      }), {params:{outVal:'100%'}}),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
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

  //trocar isso por uma maquina de estados de verdade
  scoreState:string = 'out'; 
  codeState:string = 'out';
  messageState:string = 'out';
  panelStates = {score: 'out', code: 'out', message: 'out'};
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

  toggleScore() {
    this.panelStates.score = this.panelStates.score === 'out' ? 'in' : 'out';
    this.panelStates.code = 'out';
    this.panelStates.message = 'out';
  }
  toggleCode() {
    this.panelStates.code = this.panelStates.code === 'out' ? 'in' : 'out';
    this.panelStates.score = 'out';
    this.panelStates.message = 'out';

  }

  toggleMessages() {
    this.panelStates.message  = this.panelStates.message === 'out' ? 'in' : 'out';
    this.panelStates.score = 'out';
    this.panelStates.code = 'out';

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
