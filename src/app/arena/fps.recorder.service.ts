import { Injectable } from "@angular/core";
import { EventsService } from "../shared/events.service";

export interface FPSInfo {
  matchID: number;
  messages: number;
  engine3D: number;
}
const TIME_BETWEEN_SAVE = 45000;

@Injectable({
  providedIn: "root",
})
export class FPSRecorderService {
  lastSavedTimestamp = 0;
  constructor(private events: EventsService) {}

  record(fps: FPSInfo) {

    // skip saving playground FPS
    if (fps.matchID) {
      const elapsed = Date.now() - this.lastSavedTimestamp;

      if (elapsed > TIME_BETWEEN_SAVE) {
        this.lastSavedTimestamp = Date.now();

        fps = this.checkValues(fps);
        this.events.saveValues(
          "fps-client",
          "matchID,fpsmessage,fpsEngine3D",
          fps.matchID,
          fps.messages,
          fps.engine3D
        );
      }
    }
  }

  checkValues(fps: FPSInfo): FPSInfo {
    // remove infinity
    if( !isFinite(fps.messages)){
      fps.messages = 0;
    }
    if( !isFinite(fps.engine3D)){
      fps.engine3D = 0;
    }

    // round FPS
    fps.messages = Math.round(fps.messages);
    fps.engine3D = Math.round(fps.engine3D);
    return fps;
  }
}
