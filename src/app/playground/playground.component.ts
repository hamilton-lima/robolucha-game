import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GameDefinition, MatchState } from "../watch-match/watch-match.model";
import { Subject } from "rxjs";
import defaultMatchState from "./default-match-state";
import { characterAnimations } from "../arena/luchador3d";

@Component({
  selector: "app-playground",
  templateUrl: "./playground.component.html",
  styleUrls: ["./playground.component.css"]
})
export class PlaygroundComponent implements OnInit, AfterViewInit {
  readonly gameDefinition: GameDefinition;
  readonly matchStateSubject: Subject<MatchState>;
  public readonly fps: Subject<number> = new Subject();

  data: string;
  matchState: MatchState;
  cameraFollowLuchador = false;
  animateSubject: Subject<string>;
  from: number = 130;
  to: number = 145;

  rotating: boolean;
  rotateId: any;

  rotatingGun: boolean;
  rotateGunId: any;

  animationNames = characterAnimations.map(animation => {
    return animation.name;
  });

  constructor() {
    this.gameDefinition = {
      arenaWidth: 2400,
      arenaHeight: 1200,
      luchadorSize: 60,
      bulletSize: 16
    };

    this.matchStateSubject = new Subject<MatchState>();
    this.animateSubject = new Subject<string>();
  }

  ngOnInit(): void {
    this.matchState = JSON.parse(JSON.stringify(defaultMatchState));

    let id = 1;
    this.matchState.luchadores.forEach(luchador => {
      luchador.id = id++;
    });

    this.data = JSON.stringify(this.matchState);
  }

  ngAfterViewInit(): void {
    this.onChange(this.data);
  }

  onChange(event) {
    // console.log("on change", event);
    this.matchState = JSON.parse(event);
    this.matchStateSubject.next(this.matchState);
  }

  toggleCameraFollow() {
    this.cameraFollowLuchador = !this.cameraFollowLuchador;
  }

  animate(name) {
    this.animateSubject.next(name);
  }

  toggleRotate() {
    this.rotating = !this.rotating;

    if (this.rotating) {
      this.rotateId = setInterval(this.rotate.bind(this), 1000 / 60);
    } else {
      clearInterval(this.rotateId);
    }
  }

  toggleRotateGun() {
    this.rotatingGun = !this.rotatingGun;

    if (this.rotatingGun) {
      this.rotateGunId = setInterval(this.rotateGun.bind(this), 1000 / 60);
    } else {
      clearInterval(this.rotateGunId);
    }
  }

  rotate() {
    // console.log(this.matchState);
    this.matchState.luchadores.forEach(luchador => {
      luchador.angle++;
    });
    this.matchStateSubject.next(this.matchState);
  }

  rotateGun() {
    this.matchState.luchadores.forEach(luchador => {
      luchador.gunAngle++;
    });
    this.matchStateSubject.next(this.matchState);
  }
}
