import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassroomListComponent } from './classroom-list/classroom-list.component';
import { ClassroomCreateComponent } from './classroom-create/classroom-create.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [ClassroomListComponent, ClassroomCreateComponent, MainDashboardComponent]
})
export class DashboardModule { }
