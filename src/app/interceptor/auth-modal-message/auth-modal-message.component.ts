import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-modal-message',
  templateUrl: './auth-modal-message.component.html',
  styleUrls: ['./auth-modal-message.component.css']
})
export class AuthModalMessageComponent {

  refresh(){
    const url = window.location.protocol + "//" + window.location.hostname;
    console.log("refreshing the page: ", url);
    window.location.assign(url);
  }
}
