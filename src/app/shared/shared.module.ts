import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleGuardComponent } from './role-guard/role-guard.component';
import { GameBackgroundComponent } from './game-background/game-background.component';
import { RoundButtonComponent } from './round-button/round-button.component';
import { HomeButtonComponent } from './home-button/home-button.component';
import { HeaderComponent } from './header/header.component';
import { GameCardComponent } from './game-card/game-card.component';
import { BigButtonComponent } from './big-button/big-button.component';
import { MaterialAllComponentsModule } from '../material-all-components-module';

@NgModule({
  imports: [
    CommonModule,
    MaterialAllComponentsModule,
  ],
  declarations: [
    BigButtonComponent,
    GameBackgroundComponent,
    GameCardComponent,
    HeaderComponent,
    HomeButtonComponent,
    RoleGuardComponent,
    RoundButtonComponent,
  ],
  exports:[
    BigButtonComponent,
    GameBackgroundComponent,
    GameCardComponent,
    HeaderComponent,
    HomeButtonComponent,
    RoleGuardComponent,
    RoundButtonComponent,
  ]
})
export class SharedModule { }
