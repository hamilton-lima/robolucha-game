import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { CanComponentDeactivate } from "./can-deactivate-guard.service";
import { DefaultService } from "./sdk";

@Injectable({
  providedIn: "root"
})
export class EndTutorialGuardService
  implements CanDeactivate<CanComponentDeactivate> {
  constructor(private api: DefaultService) {}

  canDeactivate(component: CanComponentDeactivate) {
    this.api
      .privateLeaveTutorialMatchPost()
      .subscribe(response => console.log(response));
    return true;
  }
}
