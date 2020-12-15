import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { DefaultService, ModelGameDefinition } from "../sdk";
import { MapEditorService } from "./map-editor.service";

@Component({
  selector: "app-map-editor",
  templateUrl: "./map-editor.component.html",
  styleUrls: ["./map-editor.component.scss"],
})
export class MapEditorComponent implements OnInit {
  name: string;
  definitions: ModelGameDefinition[];
  constructor(
    private api: DefaultService,
    private router: Router,
    private service: MapEditorService
  ) {}

  ngOnInit() {
    this.definitions = [];
    this.api.privateMapeditorGet().subscribe((result) => {
      this.definitions = result;
      this.service.setGameDefinitions(result);
    });
  }

  create() {
    this.router.navigate(["maps/create", this.definitions.length]);
  }

  edit(id) {
    this.router.navigate(["maps/edit", id]);
  }
}
