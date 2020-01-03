import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "src/app/auth.service";
import { map } from "rxjs/operators";
import { ModelUserDetails } from "src/app/sdk";
import { BehaviorSubject, Subject } from "rxjs";
import { Observable } from "babylonjs";

export const dashboardUser = "dashboard_user";

@Component({
  selector: "app-role-guard",
  templateUrl: "./role-guard.component.html",
  styleUrls: ["./role-guard.component.scss"]
})
export class RoleGuardComponent implements OnInit {
  @Input() role: string;
  authorized = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    console.log("init", this.role);

    this.authService.isLoggedIn().subscribe((user: ModelUserDetails) => {
      console.log("detailes", user);

      const found = user.roles.find((search: string) => {
        return search === this.role;
      });

      console.log("found", found);
      if (found) {
        this.authorized = true;
      } else {
        this.authorized = false;
      }
    });
  }
}
