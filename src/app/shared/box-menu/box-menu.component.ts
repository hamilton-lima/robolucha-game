import { Component, Input, OnInit } from "@angular/core";

export enum BoxMenuBarType {
  Premium = "base_tag_premium.png",
  MaskEditor = "base_tag_maskeditor.png",
  PVP = "base_tag_pvp.png",
  Reward = "base_tag_reward.png",
  Play = "base_tag_play.png",
}

export enum BoxMenuStartType {
  Green = "start_green.png",
  Purple = "start_purple.png",
  Yellow = "start_yellow.png",
}

export enum BoxMenuColor {
  Green = "#00FF12",
  Purple = "#EB61FF",
  Yellow = "#FFC600",
}

export class BoxMenuItem {
  backgroundURL: string;
  expandable? = false;
  barType: BoxMenuBarType;
  label: string;
  color: BoxMenuColor;
  description?: string;
  start: BoxMenuStartType;
  onClick?: Function;
  onStartClick?: Function;
}

@Component({
  selector: "app-box-menu",
  templateUrl: "./box-menu.component.html",
  styleUrls: ["./box-menu.component.scss"],
})
export class BoxMenuComponent implements OnInit {
  all: BoxMenuItem[] = [];
  visible: BoxMenuItem[] = [];

  @Input()
  get items() {
    return this.all;
  }
  set items(input: BoxMenuItem[]) {
    this.all = input;
    this.visible = input.slice(0, 3);
  }

  constructor() {}

  ngOnInit() {}
}
