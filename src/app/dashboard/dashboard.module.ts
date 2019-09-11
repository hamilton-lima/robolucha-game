import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassroomListComponent } from './classroom-list/classroom-list.component';
import { ClassroomCreateComponent } from './classroom-create/classroom-create.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ClassroomListComponent, ClassroomCreateComponent, MainDashboardComponent]
})
export class DashboardModule { }
