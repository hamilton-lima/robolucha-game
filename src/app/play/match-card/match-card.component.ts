import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MainMatch, MainJoinMatch } from 'src/app/sdk';

@Component({
  selector: 'app-match-card',
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.css']
})
export class MatchCardComponent {
  @Input() match: MainMatch;
  @Output() matchSelected = new EventEmitter<MainMatch>();

  join(match: MainMatch) {
    console.log("join match", match);
    this.matchSelected.emit(match);
  }

}
