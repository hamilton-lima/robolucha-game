import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassroomListComponent } from './classroom-list/classroom-list.component';
import { ClassroomCreateComponent } from './classroom-create/classroom-create.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { RouterModule } from '@angular/router';
import { ClassroomCardComponent } from './shared/classroom-card/classroom-card.component';
import { MaterialAllComponentsModule } from '../material-all-components-module';
import { DashboardHeaderComponent } from './shared/dashboard-header/dashboard-header.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialAllComponentsModule,
    SharedModule
  ],
  declarations: [ClassroomListComponent, ClassroomCreateComponent, MainDashboardComponent, ClassroomCardComponent, DashboardHeaderComponent]
})
export class DashboardModule { }
