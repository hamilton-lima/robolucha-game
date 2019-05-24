import { Component, OnInit } from '@angular/core';

import { SharedStateService } from "../shared-state.service";
import { debug } from 'util';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  hasMatch : boolean;

  constructor(
    private shared: SharedStateService) {
   }

  ngOnInit() {
    this.hasMatch = true;
  }


  endMatch(){
    this.shared.setCurrentMatch(null);
  }

  checkMatch(){
    if (this.shared.getCurrentMatch() == null)
    {
      return false;
    }
    return true;
  }
}
