import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { DefaultService, MainGameDefinition } from "../sdk";
import { NgxSpinnerService } from "ngx-spinner";

export interface Selection {
  position: number;
  total: number;
  value: number;
  label: string;
}

@Component({
  selector: "app-first",
  templateUrl: "./first.component.html",
  styleUrls: ["./first.component.css"]
})
export class FirstComponent implements OnInit {
  gameDefinitions: MainGameDefinition[];
  gameDefinition: MainGameDefinition;
  selection = <Selection>{ value: 0, label: "N/A"};

  constructor(
    private router: Router,
    private api: DefaultService,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.api
      .privateGameDefinitionAllGet()
      .subscribe((gamedefinitions: MainGameDefinition[]) => {
        this.gameDefinitions = gamedefinitions;
        if (gamedefinitions.length > 0) {
          this.gameDefinition = gamedefinitions[0];
          this.selection.total = gamedefinitions.length;
        }
        this.updateSelection(0);
        this.spinner.hide();
      });
  }

  updateSelection(position: number) {
    if (position < 0) {
      position = 0;
    }

    if (position >= this.selection.total) {
      position = this.selection.total - 1;
    }

    this.selection.position = position;
    this.selection.value = Math.floor((position+1) / this.selection.total * 100);
    this.selection.label = position + 1 + " of " + this.selection.total;

    this.gameDefinition = this.gameDefinitions[position];
  }

  left() {
    this.updateSelection(this.selection.position - 1);
  }

  right() {
    this.updateSelection(this.selection.position + 1);
  }
}
