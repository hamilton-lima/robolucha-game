import { Component, OnInit } from '@angular/core';
import { DefaultService, ModelClassroom } from 'src/app/sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classroom-create',
  templateUrl: './classroom-create.component.html',
  styleUrls: ['./classroom-create.component.scss']
})
export class ClassroomCreateComponent implements OnInit {

  constructor( private api: DefaultService , private router: Router) { }
  ngOnInit() {
  }

  createClassroom(event: any){
    event.preventDefault();
    
    const name = event.target.classroomName.value;;
    const classroom: ModelClassroom = { name: name };
    
    this.api.dashboardClassroomPost(classroom).subscribe(response => {
      this.router.navigate(["/admin/classrooms"])
    });
  }

}
