import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleGuardComponent } from './role-guard/role-guard.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    RoleGuardComponent
  ],
  exports:[
    RoleGuardComponent
  ]
})
export class SharedModule { }
