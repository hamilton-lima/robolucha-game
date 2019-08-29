import { Component, OnInit } from '@angular/core';
import { DefaultService, ModelActiveMatch } from 'src/app/sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-public-games',
  templateUrl: './list-public-games.component.html',
  styleUrls: ['./list-public-games.component.css']
})
export class ListPublicGamesComponent implements OnInit {

  matches: Array<ModelActiveMatch> = [];

  constructor(private api: DefaultService, private router: Router) {}

  ngOnInit() {
    this.api.privateAvailableMatchPublicGet().subscribe((matches: Array<ModelActiveMatch>) => {
      console.log("matches", matches);
      this.matches = matches;
    });
  }

}
