import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GameDefinition, MatchState } from "../watch-match/watch-match.model";
import { Subject } from "rxjs";
import sampleMatchState from "./sample-match-state";

@Component({
  selector: "app-playground",
  templateUrl: "./playground.component.html",
  styleUrls: ["./playground.component.css"]
})
export class PlaygroundComponent implements OnInit, AfterViewInit{
  readonly gameDefinition: GameDefinition;
  readonly matchStateSubject: Subject<MatchState>;
  data: string;

  constructor() {
    this.gameDefinition = {
      arenaWidth: 1200,
      arenaHeight: 800,
      luchadorSize: 60,
      bulletSize: 16
    };

    this.matchStateSubject = new Subject<MatchState>();
  }

  ngOnInit(): void {
    this.data = JSON.stringify(sampleMatchState);
  }

  ngAfterViewInit(): void {
    this.onChange(this.data);
  }

  onChange(event) {
    const matchState = JSON.parse(event);
    this.matchStateSubject.next(matchState);
  }
}
