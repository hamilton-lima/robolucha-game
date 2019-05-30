import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameDefinition } from '../watch-match/watch-match.model';
import { MainGameDefinition, DefaultService } from '../sdk';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css']
})
export class FirstComponent implements OnInit {

  tutorials: Array<MainGameDefinition>
  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private api: DefaultService) { 
    this.tutorials = [];
  }

  ngOnInit() {
    if(localStorage.getItem("hadFirst") == "true"){
      this.router.navigate(['luchador']);
    }
    else {
      localStorage.setItem("hadFirst", "true");
      const data = this.route.snapshot.data;
      this.tutorials = data.tutorials;

    }
  }



}
