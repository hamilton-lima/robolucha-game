import { Component, OnInit } from '@angular/core';

import { SharedStateService } from "../shared-state.service";
import { debug } from 'util';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  constructor(
    private shared: SharedStateService) {
   }

  ngOnInit() {
    this.checkMatch();
  }

  checkMatch(){
    if (this.shared.getCurrentMatch() == null)
    {
      return false;
    }
    return true;
  }
}
