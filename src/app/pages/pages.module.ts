import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "./main/main.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialAllComponentsModule } from "./material-all-components-module";
import { ListPublicGamesComponent } from "./list-public-games/list-public-games.component";
import { RouterModule } from "@angular/router";
import { ListClassroomGamesComponent } from "./list-classroom-games/list-classroom-games.component";
import { RoundButtonComponent } from "./shared/round-button/round-button.component";
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { HomeButtonComponent } from "./shared/home-button/home-button.component";
import { HeaderComponent } from "./shared/header/header.component";
import { GameCardComponent } from "./shared/game-card/game-card.component";
import { JoinClassroomComponent } from "./list-classroom-games/join-classroom/join-classroom.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    MaterialAllComponentsModule
  ],
  declarations: [
    MainComponent,
    ListPublicGamesComponent,
    ListClassroomGamesComponent,
    RoundButtonComponent,
    HomeButtonComponent,
    HeaderComponent,
    GameCardComponent,
    JoinClassroomComponent
  ]
})
export class PagesModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl("./assets/mdi.svg")
    );
  }
}
