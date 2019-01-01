import { Component, OnInit } from '@angular/core';
import { DefaultService } from '../sdk/api/default.service';
import { MainLuchador } from '../sdk/model/mainLuchador';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  luchador: MainLuchador
  
  constructor(private api: DefaultService) { }

  ngOnInit() {
  }

  create(){
    this.api.privateLuchadorPost().subscribe((response: MainLuchador) => {
      this.luchador = response;
    });
  }

}
