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
  mock: Score[];

  constructor() { 
    this.scores = [];
    this.mock = [{"id":22,"name":"Gecko","k":0,"d":0,"score":60},{"id":23,"name":"Lighthouse","k":0,"d":0,"score":40},{"id":4,"name":"Something Cool","k":0,"d":0,"score":0}];
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

  format(pos:number){
    let result = pos +1;
    const preffix = result < 10 ? "0" : "";
    return preffix + result;
  }
}
