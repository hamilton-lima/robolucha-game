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
import { HomeComponent } from "./home/home.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { ApiModule } from "./sdk/api.module";

const ROUTES: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent, canActivate: [LoginActivate] },
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    DashBoardComponent,
    LoginComponent,
    NotFoundComponent,
    SetupComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ApiModule,
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  providers: [LoginActivate, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
