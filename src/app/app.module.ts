import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { BodyComponent } from "./body/body.component";
import {
  LoginActivate,
  LoginDashboardActivate,
} from "./login.activate.service";
import { NotFoundComponent } from "./not-found/not-found.component";
import { AuthService } from "./auth.service";
import { LuchadorComponent } from "./luchador/luchador.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApiModule } from "./sdk/api.module";
import { environment } from "src/environments/environment";
import { Configuration, ConfigurationParameters } from "./sdk/configuration";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AceEditorModule } from "ng2-ace-editor";
import { LuchadorResolverService } from "./luchador-resolver.service";
import { WatchMatchComponent } from "./watch-match/watch-match.component";
import { ArenaComponent } from "./arena/arena.component";
import { PlaygroundComponent } from "./playground/playground.component";
import { PlayComponent } from "./play/play.component";
import { CanDeactivateGuard } from "./can-deactivate-guard.service";
import { ScoreComponent } from "./score/score.component";
import { ClockComponent } from "./clock/clock.component";
import { CodeEditorPanelComponent } from "./code-editor-panel/code-editor-panel.component";
import { WatchPageComponent } from "./watch-page/watch-page.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { MatchCardComponent } from "./play/match-card/match-card.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpConfigInterceptor } from "./interceptor/httpconfig.interceptor";
import { AuthModalMessageComponent } from "./interceptor/auth-modal-message/auth-modal-message.component";
import { MainComponent } from "./pages/main/main.component";
import { PagesModule } from "./pages/pages.module";
import { ListPublicGamesComponent } from "./pages/list-public-games/list-public-games.component";
import { ListClassroomGamesComponent } from "./pages/list-classroom-games/list-classroom-games.component";
import { MaskEditorComponent } from "./pages/mask-editor/mask-editor.component";
import { MaterialAllComponentsModule } from "./material-all-components-module";
import { MainDashboardComponent } from "./dashboard/main-dashboard/main-dashboard.component";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ClassroomListComponent } from "./dashboard/classroom-list/classroom-list.component";
import { ClassroomCreateComponent } from "./dashboard/classroom-create/classroom-create.component";
import { StudentListComponent } from "./dashboard/student-list/student-list.component";
import { GenericErrorModalMessageComponent } from "./interceptor/generic-error-modal-message/generic-error-modal-message.component";
import { AboutComponent } from "./pages/about/about.component";
import { EndTutorialGuardService } from "./end-tutorial-guard.service";
import { ActivityListComponent } from "./dashboard/activity-list/activity-list.component";
import { LobbyComponent } from "./lobby/lobby.component";
import { CantPlayComponent } from "./lobby/cant-play/cant-play.component";
import { CodeBlocklyComponent } from './shared/code-blockly/code-blockly.component';
import { MapEditorComponent } from './map-editor/map-editor.component';
import { GameDefinitionCreateComponent } from "./map-editor/game-definition-create/game-definition-create.component";
import { GameDefinitionEditComponent } from "./map-editor/game-definition-edit/game-definition-edit.component";
import { GameDefinitionCardComponent } from "./map-editor/game-definition-card/game-definition-card.component";
import { SharedModule } from "./shared/shared.module";
import { SingleSceneComponentEditorComponent } from './map-editor/game-definition-edit/editor/single-scene-component-editor/single-scene-component-editor.component';
import { BasicInfoEditorComponent } from './map-editor/game-definition-edit/editor/basic-info-editor/basic-info-editor.component';
import { GameDefinitionCodeEditorComponent } from './map-editor/game-definition-edit/editor/game-definition-code-editor/game-definition-code-editor.component';
import { BasicInfoComponent } from './map-editor/game-definition-edit/display/basic-info/basic-info.component';
import { GameDefinitionCodeComponent } from './map-editor/game-definition-edit/display/game-definition-code/game-definition-code.component';
import { SceneComponentsComponent } from './map-editor/game-definition-edit/display/scene-components/scene-components.component';
import { WallPaperGeneratorComponent } from './wall-paper-generator/wall-paper-generator.component';
import { GameDefinitionSuggestedCodeEditorComponent } from './map-editor/game-definition-edit/editor/game-definition-suggested-code-editor/game-definition-suggested-code-editor.component';

const ROUTES: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  {
    path: "edit",
    component: LuchadorComponent,
    canActivate: [LoginActivate],
    canDeactivate: [CanDeactivateGuard],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "mask",
    component: MaskEditorComponent,
    canActivate: [LoginActivate],
    canDeactivate: [CanDeactivateGuard],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "wallpaper",
    component: WallPaperGeneratorComponent,
    canActivate: [LoginActivate],
    canDeactivate: [CanDeactivateGuard],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "maps",
    component: MapEditorComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "maps/create",
    component: GameDefinitionCreateComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "maps/edit/:id",
    component: GameDefinitionEditComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "playground",
    component: PlaygroundComponent,
    canActivate: [LoginActivate],
  },
  {
    path: "lobby",
    component: LobbyComponent,
    canActivate: [LoginActivate],
  },
  {
    path: "play",
    component: PlayComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "watch/:id",
    component: WatchPageComponent,
    canActivate: [LoginActivate],
    canDeactivate: [CanDeactivateGuard, EndTutorialGuardService],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "public",
    component: ListPublicGamesComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "classroom",
    component: ListClassroomGamesComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "about",
    component: AboutComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "home",
    component: MainComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService },
  },
  {
    path: "dashboard",
    canActivate: [LoginDashboardActivate],
    component: MainDashboardComponent,
    children: [
      { path: "activities", component: ActivityListComponent },
      { path: "classrooms", component: ClassroomListComponent },
      { path: "classroom-create", component: ClassroomCreateComponent },
      { path: "classroom-students/:id", component: StudentListComponent },
      { path: "", redirectTo: "classrooms", pathMatch: "full" },
    ],
  },
  { path: "**", redirectTo: "/home" },
];

export function apiConfigFactory(): Configuration {
  let authorization = {};
  const testUser = sessionStorage.getItem("robolucha-test-user");

  if (testUser) {
    console.log("Creating session with testUser", testUser);
    authorization = { Authorization: testUser };
  }

  const params: ConfigurationParameters = {
    apiKeys: authorization,
    basePath: environment.BASE_PATH,
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    NotFoundComponent,
    LuchadorComponent,
    WatchMatchComponent,
    ArenaComponent,
    PlaygroundComponent,
    PlayComponent,
    ScoreComponent,
    ClockComponent,
    CodeEditorPanelComponent,
    WatchPageComponent,
    MatchCardComponent,
    AuthModalMessageComponent,
    GenericErrorModalMessageComponent,
    LobbyComponent,
    CantPlayComponent,
    GameDefinitionCardComponent,
    GameDefinitionCreateComponent,
    GameDefinitionEditComponent,
    MapEditorComponent,
    SingleSceneComponentEditorComponent,
    BasicInfoEditorComponent,
    GameDefinitionCodeEditorComponent,
    BasicInfoComponent,
    GameDefinitionCodeComponent,
    SceneComponentsComponent,
    WallPaperGeneratorComponent,
    GameDefinitionSuggestedCodeEditorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ApiModule.forRoot(apiConfigFactory),
    RouterModule.forRoot(ROUTES, { useHash: true }),
    NgbModule,
    AceEditorModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    PagesModule,
    DashboardModule,
    MaterialAllComponentsModule,
    SharedModule
  ],
  providers: [
    LoginActivate,
    LoginDashboardActivate,
    AuthService,
    CanDeactivateGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AuthModalMessageComponent,
    GenericErrorModalMessageComponent,
  ]
})
export class AppModule {}
