import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home-button",
  templateUrl: "./home-button.component.html",
  styleUrls: ["./home-button.component.css"]
})
export class HomeButtonComponent implements OnInit {
  @Output() onClick = new EventEmitter<string>();
  constructor(private router: Router) {}
  ngOnInit() {}

  onclick() {
    this.onClick.emit();
    this.router.navigate(["home"]);
  }
}
