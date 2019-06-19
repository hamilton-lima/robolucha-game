import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, Subject } from "rxjs";
import { MatchState, GameDefinition, Score } from "../watch-match/watch-match.model";

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnChanges {

  @Input() scores: Score[];

  constructor() { 
    this.scores = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    this.scores = this.scores.sort(this.compareScores).reverse();
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
