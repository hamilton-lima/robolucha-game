import { Component, OnInit, Input, Output } from "@angular/core";
import { ModelClassroom } from "src/app/sdk";
import { EventEmitter } from "events";

@Component({
  selector: "app-classroom-card",
  templateUrl: "./classroom-card.component.html",
  styleUrls: ["./classroom-card.component.scss"]
})
export class ClassroomCardComponent implements OnInit {
  @Output() onStudents = new EventEmitter();
  @Output() onAssignments = new EventEmitter();

  @Input() classroom: ModelClassroom;
  constructor() {}

  ngOnInit() {}

  triggerOnStudents() {
    this.onStudents.emit(null);
  }

  triggerOnAssignments() {
    this.onAssignments.emit(null);
  }
}
