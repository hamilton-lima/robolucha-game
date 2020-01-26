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

  onSuccess = () => {};

  onError = error => {
    console.error("Error updating user settings", error);
  };

  updateSettings(settings: ModelUserSetting) {
    this.user.settings = settings;
    this.api
      .privateUserSettingPut(settings)
      .subscribe(this.onSuccess, this.onError);
  }

  resetAllSettings() {
    this.user.settings.playedTutorial = false;
    this.user.settings.visitedMainPage = false;
    this.user.settings.visitedMaskPage = false;
    return this.api.privateUserSettingPut(this.user.settings);
  }
}
