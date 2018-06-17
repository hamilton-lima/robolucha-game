import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestWebsocketService {
  readonly url: string = 'ws://localhost:5000/message';
  private socket: WebSocket;
  readonly message: Subject<string> = new Subject();

  constructor() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => {
      this.socket.onmessage = (event: MessageEvent) => {
        this.message.next(event.data);
      };
    };
  }

  send(msg: string) {
    this.socket.send(msg);
  }

}
