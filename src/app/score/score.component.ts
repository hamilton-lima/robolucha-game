import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Subject } from "rxjs";
import { MatchState, GameDefinition } from "../watch-match/watch-match.model";

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  @Input() matchStateSubject: Subject<MatchState>;
  private matchState: MatchState;

  constructor() { 
    this.matchState = <MatchState>{ scores: []};
  }

  ngOnInit() {
    this.matchStateSubject.subscribe((matchState: MatchState) => {
      this.matchState = matchState;
    });
  }

  sortedScores() {
    return this.matchState.scores.sort(this.compareScores).reverse();
  }

  compareScores(a, b) {
    if (a.score < b.score) {
      return -1;
    }

    if (a.score > b.score) {
      return 1;
    }

    return 0;
  }
}
