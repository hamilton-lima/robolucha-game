import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { BodyComponent } from "./body/body.component";
import { LoginActivate } from "./login.activate.service";
import { DashBoardComponent } from "./dash-board/dash-board.component";
import { LoginComponent } from "./login/login.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { AuthService } from "./auth.service";
import { SetupComponent } from "./setup/setup.component";
import { LuchadorComponent } from "./luchador/luchador.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ApiModule } from "./sdk/api.module";
import { environment } from "src/environments/environment";
import { Configuration, ConfigurationParameters } from "./sdk/configuration";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

const ROUTES: Routes = [
  { path: "", redirectTo: "/luchador", pathMatch: "full" },
  { path: "luchador", component: LuchadorComponent, canActivate: [LoginActivate] },
  {
    path: "dashboard",
    component: DashBoardComponent,
    canActivate: [LoginActivate]
  },
  { path: "login", component: LoginComponent },
  {
    path: "setup",
    component: SetupComponent,
    canActivate: [LoginActivate]
  },
  { path: "**", component: NotFoundComponent }
];

export function apiConfigFactory (): Configuration {
  const params: ConfigurationParameters = {
    apiKeys: {},
    basePath: environment.BASE_PATH
  }
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    DashBoardComponent,
    LoginComponent,
    NotFoundComponent,
    SetupComponent,
    LuchadorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ApiModule.forRoot(apiConfigFactory),
    RouterModule.forRoot(ROUTES, { useHash: true }),
    NgbModule
  ],
  providers: [
    LoginActivate,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
