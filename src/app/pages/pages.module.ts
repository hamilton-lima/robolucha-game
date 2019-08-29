import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "./main/main.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialAllComponentsModule } from "./material-all-components-module";
import { ListPublicGamesComponent } from './list-public-games/list-public-games.component';
import { RouterModule } from "@angular/router";
import { ListClassroomGamesComponent } from './list-classroom-games/list-classroom-games.component';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, RouterModule, MaterialAllComponentsModule],
  declarations: [MainComponent, ListPublicGamesComponent, ListClassroomGamesComponent]
})
export class PagesModule {}
