import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModelMatch, ModelJoinMatch, ModelActiveMatch } from 'src/app/sdk';

@Component({
  selector: 'app-match-card',
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.css']
})
export class MatchCardComponent {
  @Input() match: ModelActiveMatch;
  @Output() matchSelected = new EventEmitter<ModelActiveMatch>();

  join(match: ModelActiveMatch) {
    // console.log("join match", match);
    this.matchSelected.emit(match);
  }

  getImageName(){
    return "assets/maps/" + this.match.name.toLowerCase() + ".png";
  }

  showTimeStart(){
    return this.match.type === "multiplayer";
  }
}
