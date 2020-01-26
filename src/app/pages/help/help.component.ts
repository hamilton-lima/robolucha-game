import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/shared/user.service";
import { AlertService } from "../alert.service";

@Component({
  selector: "app-help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.scss"]
})
export class HelpComponent implements OnInit {
  constructor(private userService: UserService, private alert: AlertService) {}

  ngOnInit() {}

  resetContextualMessages() {
    this.userService.resetAllSettings().subscribe(
      () => {
        this.alert.info("Contextual help reset to default", "DISMISS");
      },
      () => {
        this.alert.error(
          "Error when reseting Contextual help to default",
          "DISMISS"
        );
      }
    );
  }
}
