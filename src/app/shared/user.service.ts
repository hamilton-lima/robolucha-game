import { Injectable } from "@angular/core";
import { ModelUserDetails, ModelUserSetting, DefaultService } from "../sdk";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private user: ModelUserDetails;

  constructor(private api: DefaultService) {}

  setUser(user: ModelUserDetails) {
    this.user = user;
  }

  getUser(): ModelUserDetails {
    return this.user;
  }

  updateSettings(settings: ModelUserSetting) {
    this.api.privateUserSettingPut(settings).subscribe(
      response => {
        console.log("response", response);
      },
      error => {
        console.log("error", error);
      }
    );
    this.user.settings = settings;
  }
}
