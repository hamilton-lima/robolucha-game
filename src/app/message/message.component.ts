import { Component, OnInit, Input } from '@angular/core';
import { MatchState } from '../watch-match/watch-match.model';
import { Subject } from 'rxjs';
import { Message } from './message.model';

const MAX_MESSAGES = 20;

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input() messageSubject: Subject<Message>;
  private message : Message;

  messageList: Array<Message>;
  constructor() { 
    
  }

  ngOnInit() {
    this.messageList = new Array<Message>();
    this.messageSubject.subscribe((message: Message) => {
      this.message = message;
      this.processMessage();
      this.processMessageList();
    }); 

  }

  private processMessage() {
    switch (this.message.type) {
      case "debug": {
        this.message.color = "";
        break;
      }
      case "warning": {
        this.message.color = "#fff3cd";
        break;
      }
      case "danger": {
        this.message.color = "#f8d7da";
        break;
      }
    }
    // this.message.when = this.matchState.clock.toString();
  }

  private processMessageList() {
    this.cleanMessageList();

    let l = this.messageList.push(this.message);
    //max elements reached, remove oldest
    if (l > MAX_MESSAGES) {
      this.messageList.splice(0, 1);
      l = this.messageList.length;
    }
    
  }

  private cleanMessageList() {
    //removing null elements
    for (let i = 0; i < this.messageList.length; i++) {
      if (!this.messageList[i]) {
        this.messageList.splice(i, 1);
      }
    }
  }

  getUserMessages(){
    if (this.messageList){
      return this.messageList;
    }
    return [];
  }

  

}
