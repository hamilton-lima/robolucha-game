import { Component, OnInit } from '@angular/core';
import { TestWebsocketService } from './test-websocket.service';

@Component({
  selector: 'app-test-websocket',
  templateUrl: './test-websocket.component.html',
  styleUrls: ['./test-websocket.component.scss']
})
export class TestWebsocketComponent implements OnInit {
  sent: string;
  received: string;

  constructor(private service: TestWebsocketService) {}

  ngOnInit() {
    this.service.message.subscribe(message => {
      this.received = message;
    });
  }

  sendTime() {
    this.sent = new Date().getTime().toString();
    this.service.send(this.sent);
  }
}