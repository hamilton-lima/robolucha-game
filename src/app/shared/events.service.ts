import { Injectable } from "@angular/core";
import { DefaultService, ModelPageEventRequest } from "../sdk";
import { Router, NavigationStart, RouterEvent } from "@angular/router";
import { AuthService } from "../auth.service";
import { VERSION } from "src/app/version";

const AppName = "robolucha-game";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  click(page: string, componentID: string) {
    const event: ModelPageEventRequest = {
      action: "click",
      page: page,
      componentID: componentID,
      appName: AppName,
      appVersion: VERSION,
    };

    this.save(event);
  }

  emit(page: string, action: string, componentID: string) {
    const event: ModelPageEventRequest = {
      action: action,
      page: page,
      componentID: componentID,
      appName: AppName,
      appVersion: VERSION,
    };

    this.save(event);
  }

  saveNavigation(url: string) {
    const pageEvent: ModelPageEventRequest = {
      action: "open",
      page: url,
      componentID: "",
      appName: AppName,
      appVersion: VERSION,
    };

    this.save(pageEvent);
  }

  saveValues(action: string, componentID: string, value1: number, value2: number, value3: number) {
    const pageEvent: ModelPageEventRequest = {
      action: action,
      page: "",
      componentID: componentID,
      appName: AppName,
      appVersion: VERSION,
      value1: value1.toString(),
      value2: value2.toString(),
      value3: value3.toString(),
    };

    this.save(pageEvent);
  }

  save(request: ModelPageEventRequest) {
    this.api.privatePageEventsPost(request).subscribe((response) => {});
  }

  constructor(
    private api: DefaultService,
    private router: Router,
    private authService: AuthService
  ) {
    const self = this;
    router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        self.saveNavigation(event.url);
      }
    });
  }
}
