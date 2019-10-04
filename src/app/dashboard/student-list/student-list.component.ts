import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  classroomID: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.classroomID = Number.parseInt(this.route.snapshot.paramMap.get("id"));
  }

}
