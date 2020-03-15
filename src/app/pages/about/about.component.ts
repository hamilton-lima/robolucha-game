import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/shared/user.service";
import { AlertService } from "../alert.service";
import { VERSION } from "src/app/version";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit {
  version = VERSION;
  constructor(private userService: UserService, private alert: AlertService) {}

  ngOnInit() {}

  resetContextualMessages() {
    this.userService.resetAllSettings().subscribe(
      () => {
        this.alert.info("Contextual Help reset to default", "DISMISS");
      },
      () => {
        this.alert.error(
          "Error when reseting Contextual Help to default",
          "DISMISS"
        );
      }
    );
  }
}
