import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialAllComponentsModule } from "../material-all-components-module";
import { ListPublicGamesComponent } from "./list-public-games/list-public-games.component";
import { RouterModule } from "@angular/router";
import { ListClassroomGamesComponent } from "./list-classroom-games/list-classroom-games.component";
import { RoundButtonComponent } from "../shared/round-button/round-button.component";
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { HomeButtonComponent } from "../shared/home-button/home-button.component";
import { JoinClassroomComponent } from "./list-classroom-games/join-classroom/join-classroom.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaskEditorComponent } from "./mask-editor/mask-editor.component";
import { LuchadorPreviewComponent } from "./mask-editor/luchador-preview/luchador-preview.component";
import { MaskEditorDetailComponent } from "./mask-editor/mask-editor-detail/mask-editor-detail.component";
import { ColorPickerComponent } from "./mask-editor/color-picker/color-picker.component";
import { ShapePickerComponent } from "./mask-editor/shape-picker/shape-picker.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../shared/shared.module";
import { AboutComponent } from "./about/about.component";
import { MainComponent } from "./main/main.component";

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialAllComponentsModule,
    NgbModule,
    SharedModule,
  ],
  declarations: [
    ListPublicGamesComponent,
    ListClassroomGamesComponent,
    JoinClassroomComponent,
    MaskEditorComponent,
    LuchadorPreviewComponent,
    MaskEditorDetailComponent,
    ColorPickerComponent,
    ShapePickerComponent,
    AboutComponent,
    MainComponent,
  ]
})
export class PagesModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl("./assets/mdi.svg")
    );
  }
}
