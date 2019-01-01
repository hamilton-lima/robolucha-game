import { Component, OnInit } from '@angular/core';
import { DefaultService } from '../sdk/api/default.service';
import { MainLuchador } from '../sdk/model/mainLuchador';

@Component({
  selector: 'app-home',
  templateUrl: './luchador.component.html',
  styleUrls: ['./luchador.component.css']
})
export class LuchadorComponent implements OnInit {

  luchador: MainLuchador

  constructor(private api: DefaultService) { }

  ngOnInit() {
    this.api.privateLuchadorGet().subscribe((response: MainLuchador) => {
      this.luchador = response;
    });
  }

}
