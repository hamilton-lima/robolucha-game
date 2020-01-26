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
    this.user.settings = settings;
    return this.api.privateUserSettingPut(settings);
  }

  resetAllSettings() {
    this.user.settings.playedTutorial = false;
    this.user.settings.visitedMainPage = false;
    this.user.settings.visitedMaskPage = false;
    return this.updateSettings(this.user.settings);
  }

}
