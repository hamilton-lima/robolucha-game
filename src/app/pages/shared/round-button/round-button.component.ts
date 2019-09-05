import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-round-button",
  templateUrl: "./round-button.component.html",
  styleUrls: ["./round-button.component.css"]
})
export class RoundButtonComponent implements OnInit {
  @Input() icon: string;
  @Input() color: string;

  @Output() onclick = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  click() {
    console.log("click inner round button");
    this.onclick.next("");
  }
}
