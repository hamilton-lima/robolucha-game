import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { MatchState } from '../watch-match/watch-match.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
  @Input() matchStateSubject: Subject<MatchState>;
  @Input() icon: string = "alarm";
  private clock: number = 0;

  constructor() { }

  ngOnInit() {
    this.matchStateSubject.subscribe((matchState: MatchState) => {
      this.clock = matchState.clock;
    });
  }

  parsedMatchTime(){
    let duration = moment.duration(this.clock);
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
