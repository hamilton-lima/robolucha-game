import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { BodyComponent } from "./body/body.component";
import { LoginActivate, LoginDashboardActivate } from "./login.activate.service";
import { NotFoundComponent } from "./not-found/not-found.component";
import { AuthService } from "./auth.service";
import { SetupComponent } from "./setup/setup.component";
import { LuchadorComponent } from "./luchador/luchador.component";
import { FormsModule } from "@angular/forms";
import { ApiModule } from "./sdk/api.module";
import { environment } from "src/environments/environment";
import { Configuration, ConfigurationParameters } from "./sdk/configuration";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AceEditorModule } from "ng2-ace-editor";
import { CodeEditorComponent } from "./code-editor/code-editor.component";
import { LuchadorResolverService } from "./luchador-resolver.service";
import { WatchMatchComponent } from "./watch-match/watch-match.component";
import { ArenaComponent } from "./arena/arena.component";
import { PlaygroundComponent } from "./playground/playground.component";
import { PlayComponent } from "./play/play.component";
import { CanDeactivateGuard } from "./can-deactivate-guard.service";
import { MessageComponent } from "./message/message.component";
import { ScoreComponent } from "./score/score.component";
import { ClockComponent } from "./clock/clock.component";
import { CodeEditorPanelComponent } from "./code-editor-panel/code-editor-panel.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { WatchPageComponent } from "./watch-page/watch-page.component";
import { HomePageComponent } from "./home-page/home-page.component";
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
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

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
    canDeactivate: [CanDeactivateGuard],
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
    path: "public",
    component: ListPublicGamesComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService }
  },
  {
    path: "classroom",
    component: ListClassroomGamesComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService }
  },
  {
    path: "home",
    component: MainComponent,
    canActivate: [LoginActivate],
    resolve: { luchador: LuchadorResolverService }
  },
  {
    path: "dashboard",
    canActivate: [LoginDashboardActivate],
    component: MainDashboardComponent,
    children: [
      { path: "classrooms", component: ClassroomListComponent },
      { path: "classroom-create", component: ClassroomCreateComponent },
      { path: "", redirectTo: "classrooms", pathMatch: "full" }
    ]
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
    BodyComponent,
    NotFoundComponent,
    SetupComponent,
    LuchadorComponent,
    CodeEditorComponent,
    WatchMatchComponent,
    ArenaComponent,
    PlaygroundComponent,
    PlayComponent,
    ScoreComponent,
    ClockComponent,
    CodeEditorPanelComponent,
    MessageComponent,
    WatchPageComponent,
    HomePageComponent,
    MatchCardComponent,
    AuthModalMessageComponent,
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
    FontAwesomeModule,
    NgxSpinnerModule,
    PagesModule,
    DashboardModule,
    MaterialAllComponentsModule,
    Angulartics2Module.forRoot(),
  ],
  providers: [
    LoginActivate,
    LoginDashboardActivate,
    AuthService,
    CanDeactivateGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AuthModalMessageComponent]
})
export class AppModule {}
