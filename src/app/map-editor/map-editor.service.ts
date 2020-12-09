import { Injectable } from "@angular/core";
import { empty } from "rxjs";
import { DefaultService, ModelGameDefinition } from "../sdk";

@Injectable({
  providedIn: "root",
})
export class MapEditorService {
  constructor(private api: DefaultService) {}

  init() {
    if (!this.definitions) {
      this.api.privateMapeditorGet().subscribe((result) => {
        this.definitions = result;
      });
    }
  }

  definitions: ModelGameDefinition[];

  setGameDefinitions(definitions: ModelGameDefinition[]) {
    console.log("set", definitions);
    this.definitions = definitions;
  }

  getGameDefinitions() {
    return this.definitions;
  }

  getGameDefinitionLabel(id: number): string {
    if (id) {
      if (this.definitions) {
        const definition = this.definitions.find(
          (definition) => definition.id == id
        );
        if (definition) {
          return definition.label;
        }
      }
    }
    return "";
  }
}
