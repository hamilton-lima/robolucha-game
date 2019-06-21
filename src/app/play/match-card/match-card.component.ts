import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MainMatch, MainJoinMatch, MainActiveMatch } from 'src/app/sdk';

@Component({
  selector: 'app-match-card',
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.css']
})
export class MatchCardComponent {
  @Input() match: MainActiveMatch;
  @Output() matchSelected = new EventEmitter<MainActiveMatch>();

  join(match: MainActiveMatch) {
    console.log("join match", match);
    this.matchSelected.emit(match);
  }

  getImageName(){
    return "assets/maps/" + this.match.name.toLowerCase() + ".png";
  }

  showTimeStart(){
    return this.match.type === "multiplayer";
  }
}
