import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { MatchState } from '../watch-match/watch-match.model';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
@Input() matchState: MatchState;

  constructor() { }

  ngOnInit() {
  }

  parsedMatchTime(){
    let duration = moment.duration(this.matchState.clock);
    return this.formatDuration(duration);
  }

  formatDuration(duration):string{
    let min = duration.minutes();
    let sec = duration.seconds();
    if (min < 10) { 
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    return min + ":" + sec;
  }

}
