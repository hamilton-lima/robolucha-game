import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
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
  table: FormGroup;

  constructor(
    private api: DefaultService,
    private router: Router,
    private service: MapEditorService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.definitions = [];

    // load all the game definitions that this user can customize
    this.api.privateMapeditorGet().subscribe((result) => {
    
      // load the list of available matches for this user
      this.api
        .privateAvailableMatchClassroomOwnedGet()
        .subscribe((availableMatches) => {
          this.definitions = result;
          this.service.setGameDefinitions(result);

          // create a form for each game definition found
          result.forEach((gameDefinition) => {
            const form = this.getForm();

            form.patchValue(gameDefinition);
            form.get("gameDefinition").setValue(gameDefinition);
            if (gameDefinition.media && gameDefinition.media.thumbnail) {
              form.get("thumbnail").setValue(gameDefinition.media.thumbnail);
            }

            const rows = this.table.get("rows") as FormArray;
            rows.push(form);
          });
        });
    });

    this.table = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  getRows() {
    return this.table.get("rows") as FormArray;
  }

  getForm(): FormGroup {
    return this.fb.group({
      id: [""],
      name: [""],
      label: [""],
      type: [""],
      description: [""],
      thumbnail: [""],
      gameDefinition: [""],
    });
  }

  create() {
    this.router.navigate(["maps/create", this.definitions.length]);
  }

  edit(id) {
    this.router.navigate(["maps/edit", id]);
  }
}
