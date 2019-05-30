import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { BodyComponent } from "./body/body.component";
import { LoginActivate } from "./login.activate.service";
import { NotFoundComponent } from "./not-found/not-found.component";
import { AuthService } from "./auth.service";
import { SetupComponent } from "./setup/setup.component";
import { LuchadorComponent } from "./luchador/luchador.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ApiModule } from "./sdk/api.module";
import { environment } from "src/environments/environment";
import { Configuration, ConfigurationParameters } from "./sdk/configuration";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AceEditorModule } from "ng2-ace-editor";
import { CodeEditorComponent } from "./code-editor/code-editor.component";
import { LuchadorResolverService } from "./luchador-resolver.service";
import { ListMatchesComponent } from "./list-matches/list-matches.component";
import { WatchMatchComponent } from "./watch-match/watch-match.component";
import { ArenaComponent } from './arena/arena.component';
import { PlaygroundComponent } from './playground/playground.component';
import { MaskEditorComponent } from './mask-editor/mask-editor.component';
import { LuchadorPreviewComponent } from './luchador-preview/luchador-preview.component';
import { MaskEditorDetailComponent } from './mask-editor-detail/mask-editor-detail.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ShapePickerComponent } from './shape-picker/shape-picker.component';
import { PlayComponent } from './play/play.component';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { MessageComponent } from './message/message.component';
import { ScoreComponent } from './score/score.component';
import { ClockComponent } from './clock/clock.component';
import { CodeEditorPanelComponent } from './code-editor-panel/code-editor-panel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { WatchPageComponent } from './watch-page/watch-page.component';
import { FirstComponent } from './first/first.component';
import { HomePageComponent } from './home-page/home-page.component';

library.add(fas);

const ROUTES: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  {
    path: "edit",
    component: LuchadorComponent,
    canActivate: [LoginActivate],
    canDeactivate: [CanDeactivateGuard],
    resolve: { luchador: LuchadorResolverService }
  },
  {
    path: "mask",
    component: MaskEditorComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService }
  },
  {
    path: "playground",
    component: PlaygroundComponent,
    canActivate: [LoginActivate]
  },
  {
    path: "play",
    component: PlayComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService }
  },
  {
    path: "watch/:id",
    component: WatchPageComponent,
    canActivate: [LoginActivate],
    canDeactivate: [CanDeactivateGuard],
    resolve: { luchador: LuchadorResolverService }
  },
  {
    path: "first",
    component: FirstComponent,
    canActivate: [LoginActivate]
  },
  {
    path: "home",
    component: HomePageComponent,
    canActivate: [LoginActivate]
  },
  { path: "**", component: NotFoundComponent }
];

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    apiKeys: {},
    basePath: environment.BASE_PATH
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    NotFoundComponent,
    SetupComponent,
    LuchadorComponent,
    CodeEditorComponent,
    ListMatchesComponent,
    WatchMatchComponent,
    ArenaComponent,
    PlaygroundComponent,
    MaskEditorComponent,
    LuchadorPreviewComponent,
    MaskEditorDetailComponent,
    ColorPickerComponent,
    ShapePickerComponent,
    PlayComponent,
    ScoreComponent,
    ClockComponent,
    CodeEditorPanelComponent,
    MessageComponent,
    WatchPageComponent,
    FirstComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ApiModule.forRoot(apiConfigFactory),
    RouterModule.forRoot(ROUTES, { useHash: true }),
    NgbModule,
    AceEditorModule,
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  providers: [LoginActivate, AuthService, CanDeactivateGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
