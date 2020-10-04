import { Injectable } from "@angular/core";
import { Observable } from "babylonjs";
import { BehaviorSubject, Subject, timer } from "rxjs";
import { environment } from "src/environments/environment";

export interface WatchDetails {
  matchID: number;
  luchadorID: number;
}

@Injectable({
  providedIn: "root"
})
export class WatchMatchService {
  private socket: WebSocket;

  public readonly ready: Subject<boolean> = new Subject();
  private readonly message: Subject<string> = new Subject();
  private readonly timer = timer(1000, 1000);
  private messages = 0;

  public readonly fps: Subject<number> = new Subject();

  constructor() {}

  connect() {
    // already connected
    if( this.socket && this.socket.readyState == WebSocket.OPEN ){
      return new BehaviorSubject(true);
    }

    // console.log("connect to the publisher", environment.PUBLISHER);
    this.socket = new WebSocket(environment.PUBLISHER);
    this.socket.onopen = () => {
      this.ready.next(true);
    };

    this.message.subscribe(() => this.messages++);

    this.timer.subscribe(() => {
      this.fps.next(this.messages);
      this.messages = 0;
    });

    return this.ready;
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
