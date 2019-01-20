import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GameDefinition, MatchState } from "../watch-match/watch-match.model";
import { Subject } from "rxjs";
import onlyLuchadorMatchState from "./only-luchador-match-state";

@Component({
  selector: "app-playground",
  templateUrl: "./playground.component.html",
  styleUrls: ["./playground.component.css"]
})
export class PlaygroundComponent implements OnInit, AfterViewInit{
  readonly gameDefinition: GameDefinition;
  readonly matchStateSubject: Subject<MatchState>;
  data: string;
  matchState: MatchState;

  constructor() {
    this.gameDefinition = {
      arenaWidth: 2400,
      arenaHeight: 1200,
      luchadorSize: 60,
      bulletSize: 16
    };

    this.matchStateSubject = new Subject<MatchState>();
  }

  ngOnInit(): void {
    this.matchState = JSON.parse(JSON.stringify(onlyLuchadorMatchState));

    let id = 1;
    this.matchState.luchadores.forEach(luchador => {
      luchador.state.id = id ++;
    });

    this.data = JSON.stringify(this.matchState);
  }

  ngAfterViewInit(): void {
    this.onChange(this.data);
  }

  onChange(event) {
    this.matchState = JSON.parse(event);
    this.matchStateSubject.next(this.matchState);
  }
}