import { Injectable } from "@angular/core";
import { DefaultService, ModelPageEventRequest } from "../sdk";
import { Router, NavigationStart, RouterEvent } from "@angular/router";
import { AuthService } from "../auth.service";

@Injectable({
  providedIn: "root"
})
export class EventsService {
  emit(page:string, action: string, componentID: string){
    const event: ModelPageEventRequest = {
      action: action,
      page: page,
      componentID: componentID
    };

    this.save(event);
  }

  saveNavigation(url: string) {
    const pageEvent: ModelPageEventRequest = {
      action: "open",
      page: url,
      componentID: ""
    };

    this.save(pageEvent);
  }

  save(request: ModelPageEventRequest) {
    this.api.privatePageEventsPost(request).subscribe(response => {
      console.log("event sent to server", request);
    });
  }

  constructor(
    private api: DefaultService,
    private router: Router,
    private authService: AuthService
  ) {
    const self = this;
    router.events.subscribe((event: RouterEvent) => {
      console.log("event", event);
      if (event instanceof NavigationStart) {
        self.saveNavigation(event.url);
      }
    });
  }
}
