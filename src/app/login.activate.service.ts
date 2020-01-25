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
import { ModelUserDetails } from "./sdk";
import { UserService } from "./shared/user.service";

export abstract class BaseActivate implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  abstract getAuthService(): Observable<ModelUserDetails>;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.getAuthService().pipe(
      map((user: ModelUserDetails) => {
        this.userService.setUser(user);

        const result = user ? true : false;
        if (!result) {
          this.router.navigate(["login"]);
        }
        return result;
      })
    );
  }
}

@Injectable()
export class LoginActivate extends BaseActivate implements CanActivate {
  constructor(private authService: AuthService, router: Router, userService: UserService) {
    super(router, userService);
  }

  getAuthService() {
    return this.authService.isLoggedIn();
  }
}

@Injectable()
export class LoginDashboardActivate extends BaseActivate
  implements CanActivate {
  constructor(private authService: AuthService, router: Router, userService: UserService) {
    super(router, userService);
  }

  getAuthService() {
    return this.authService.isLoggedInDashboard();
  }
}
