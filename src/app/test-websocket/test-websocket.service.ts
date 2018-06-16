import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TestWebsocketService {
  constructor(private socket: Socket) {}

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  getMessage(): Observable<string> {
    // .pipe( map(data => data.msg) )
    return this.socket.fromEvent<string>('message');
  }
}
