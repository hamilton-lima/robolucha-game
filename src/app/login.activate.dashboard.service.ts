import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class LoginActivateDashboard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedInDashboard().pipe(
      map(user => {
        const result = user ? true : false;
        if (!result) {
          this.router.navigate(["login"]);
        }
        return result;
      })
    );
  }
}
