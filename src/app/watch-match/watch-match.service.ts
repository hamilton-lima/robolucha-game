import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";

export interface WatchDetails {
  matchID: number;
  luchadorID: number;
}

@Injectable({
  providedIn: 'root'
})
export class WatchMatchService {
  private socket: WebSocket;

  public readonly ready: Subject<boolean> = new Subject();
  private readonly message: Subject<string> = new Subject();

  constructor() {}

  connect() {
    console.log("connect to the publisher", environment.PUBLISHER);
    this.socket = new WebSocket(environment.PUBLISHER);
    this.socket.onopen = () => {
      this.ready.next(true);
    };
  }

  close() {
    this.socket.close();
  }

  watch(details: WatchDetails): Subject<string> {
    const message = JSON.stringify(details);
    this.socket.send(message);
    this.socket.onmessage = (event: MessageEvent) => {
      this.message.next(event.data);
    };
    return this.message;
  }
}
