import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { DefaultService, ModelGameDefinition } from "../sdk";

@Component({
  selector: "app-map-editor",
  templateUrl: "./map-editor.component.html",
  styleUrls: ["./map-editor.component.scss"],
})
export class MapEditorComponent implements OnInit {
  name: string;
  definitions: ModelGameDefinition[];
  constructor(private api: DefaultService, private router: Router) {}

  ngOnInit() {
    this.definitions = [];
    this.api.privateMapeditorGet().subscribe((result) => {
      this.definitions = result;
    });
  }

  create() {
    this.router.navigate(["maps/create", this.definitions.length]);
  }

  edit(id) {
    this.router.navigate(["maps/edit", id]);
  }
}
