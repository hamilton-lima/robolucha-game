import { Injectable } from '@angular/core';

export enum AudioType{
  Fire = "/assets/audios/robolucha-shot.wav",
  Hit = "/assets/audios/robolucha-grunts",
  ArenaMusic = "/assets/audios/robolucha-arena-music.mp3",
  Move = "/assets/audios/robolucha-vehicle-engine.wav"
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  constructor() { 
  }

  arenaMusic(scene : BABYLON.Scene){
    var arenaMusic = new BABYLON.Sound("arenaMusic", AudioType.ArenaMusic, scene, null, {
      loop: true,
      autoplay: true,
      volume: 0.1
    });
  }

  fire(mesh : BABYLON.Mesh, scene : BABYLON.Scene){
    
    var fire = new BABYLON.Sound("fire", AudioType.Fire, scene, null, {
      loop: false,
      autoplay: true,
      spatialSound: true,
      maxDistance:50
    });
    fire.setPosition(mesh.position);
    fire.attachToMesh(mesh);
  }

  move(mesh : BABYLON.Mesh, scene : BABYLON.Scene){
    var move = new BABYLON.Sound("move", AudioType.Move, scene, null, {
      loop: true,
      autoplay: true,
      spatialSound: true,
      maxDistance:50,
      volume: 0.15
    });

    move.setPosition(mesh.position);
    move.attachToMesh(mesh);
  }

  hit(mesh : BABYLON.Mesh, scene : BABYLON.Scene){
    let number = Math.floor((Math.random() * 6) + 1);
    var hit = new BABYLON.Sound("hit", AudioType.Hit + number +".mp3", scene, null, {
      loop: false,
      autoplay: true,
      spatialSound: true,
      maxDistance:50
    });
    hit.setPosition(mesh.position);
    hit.attachToMesh(mesh);
  }
}
