import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameDefinition } from '../watch-match/watch-match.model';
import { MainGameDefinition, DefaultService, MainCode } from '../sdk';
import { TutorialListResolverService } from '../tutorial-list-resolver.service';
import { MainLuchador } from '../sdk/model/mainLuchador';

@Component({
  selector: "app-first",
  templateUrl: "./first.component.html",
  styleUrls: ["./first.component.css"]
})
export class FirstComponent implements OnInit {

  tutorials: MainGameDefinition[] = [];
  luchador: MainLuchador;
  selectedTutorial: MainGameDefinition;
  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private api: DefaultService) { 
      this.luchador = {};
  }

  ngOnInit() {
    this.luchador = this.route.snapshot.data.luchador;
    // this.api
    // .privateTutorialGet()
    // .subscribe((tutorials: MainGameDefinition[]) => {
    //   this.tutorials = tutorials;
    //   console.log(tutorials);
    // });
    
    this.tutorials.push(
      {type: "tutorial", name:"move1", label:"Move(1)", duration:120000, description: "Learn how to move your luchador.", suggestedCodes:[{event: "onStart", script: "move(10)"} as MainCode, {event: "onRepeat", script:"turnGun(5) \nmove(10)"}]} as MainGameDefinition,
      {type: "tutorial", name:"curve", label:"Curve",   duration:120000, description: "Learn how to turn and move in curves.", suggestedCodes:[{event: "onStart", script: "move(10)"} as MainCode, {event: "onRepeat", script:"turnGun(5) \nmove(10)"}]} as MainGameDefinition);


  }

  play(tutorial: MainGameDefinition){
    this.selectedTutorial = tutorial;
  }



}
