import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DefaultService, ModelGameDefinition } from "src/app/sdk";

@Component({
  selector: "app-game-definition-create",
  templateUrl: "./game-definition-create.component.html",
  styleUrls: ["./game-definition-create.component.scss"],
})
export class GameDefinitionCreateComponent implements OnInit {
  constructor(private api: DefaultService, private router: Router) {}
  ngOnInit() {}

  create(event: any) {
    event.preventDefault();
    console.log("event.target", event.target, event );
    const name = event.target.name.value;
    const label = event.target.label.value;
    const description = event.target.description.value;

    this.api.getDefaultGameDefinition().subscribe( gameDefinition =>{

      gameDefinition.name = name;
      gameDefinition.label = label;
      gameDefinition.description = description;

      this.api.privateMapeditorPost(gameDefinition).subscribe((response) => {
        this.router.navigate(["/maps"]);
      });
  
    })
  }
}
