import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DefaultService, ModelCode, ModelGameDefinition } from 'src/app/sdk';
import { ModelLuchador } from 'src/app/sdk/model/mainLuchador';

@Component({
  selector: 'app-game-definition-edit',
  templateUrl: './game-definition-edit.component.html',
  styleUrls: ['./game-definition-edit.component.scss']
})
export class GameDefinitionEditComponent implements OnInit {

  page: string;
  luchador: ModelLuchador
  gameDefinitionID: number;
  gameDefinition: ModelGameDefinition;
  
  // TODO: Remove this
  codes: ModelCode[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: DefaultService,
  ) { }

  ngOnInit() {
    this.page = this.route.snapshot.url.join("/");
    this.luchador = this.route.snapshot.data.luchador;
    this.gameDefinitionID = Number.parseInt(this.route.snapshot.paramMap.get("id"));

    this.api.privateGameDefinitionIdIdGet(this.gameDefinitionID).subscribe( gameDefinition => {
      this.gameDefinition = gameDefinition;
    })

  }

}
