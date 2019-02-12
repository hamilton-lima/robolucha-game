import { Injectable } from "@angular/core";
import { MainMatch } from "./sdk/model/models";

@Injectable({
  providedIn: "root"
})
export class SharedStateService {
  private match: MainMatch;

  setCurrentMatch(match: MainMatch): any {
    this.match = match;
  }

  getCurrentMatch(): MainMatch {
    return this.match;
  }

  constructor() {}
}
