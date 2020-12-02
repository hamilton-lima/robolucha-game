import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ModelNarrativeDefinition } from "src/app/sdk";
import { NARRATIVE_EVENT_START } from "src/app/shared/consts";
import {
  NarrativeDialogComponent,
  NarrativeDialogData,
} from "./narrative-dialog/narrative-dialog.component";

@Injectable({
  providedIn: "root",
})
export class NarrativeDialogService {
  constructor(public dialog: MatDialog) {}

  onStart(narratives: ModelNarrativeDefinition[]): void {
    this.show(narratives, NARRATIVE_EVENT_START);
  }

  onEnd(narratives: ModelNarrativeDefinition[]): void {
    this.show(narratives, NARRATIVE_EVENT_START);
  }

  show(narratives: ModelNarrativeDefinition[], event: string): void {
    const beforeList = narratives.filter((narrative) => {
      return narrative.event == event;
    });

    if (beforeList.length == 0) {
      console.log("empty narrative, nothing to do here");
      return;
    }

    const sorted = beforeList.sort((a, b) => {
      return a.sortOrder - b.sortOrder;
    });

    const data = <NarrativeDialogData>{
      event: event,
      narratives: sorted,
    };

    const dialogRef = this.dialog.open(NarrativeDialogComponent, {
      data: data,
    });
  }
}
