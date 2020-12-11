import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import {
  DefaultService,
  ModelAvailableMatch,
  ModelGameDefinition,
  ModelMatch,
  ModelNarrativeDefinition,
  ModelPlayRequest,
} from "src/app/sdk";
import {
  NARRATIVE_EVENT_END,
  NARRATIVE_EVENT_START,
} from "src/app/shared/consts";
import {
  NarrativeDialogComponent,
  NarrativeDialogData,
} from "./narrative-dialog/narrative-dialog.component";

@Injectable({
  providedIn: "root",
})
export class NarrativeDialogService {
  constructor(
    public dialog: MatDialog,
    private api: DefaultService,
    private router: Router
  ) {}

  onStart(narratives: ModelNarrativeDefinition[]): void {
    this.show(narratives, NARRATIVE_EVENT_START, 0);
  }

  onEnd(gameDefinition: ModelGameDefinition): void {
    this.show(
      gameDefinition.narrativeDefinitions,
      NARRATIVE_EVENT_END,
      gameDefinition.nextGamedefinitionID
    );
  }

  // check if narrative definition has onEnd event narrative
  hasOnEnd(narratives: ModelNarrativeDefinition[]) {
    const found = narratives.find(
      (narrative) => narrative.event == NARRATIVE_EVENT_END
    );

    if (found) {
      return true;
    }
    return false;
  }

  show(
    narratives: ModelNarrativeDefinition[],
    event: string,
    nextGamedefinitionID: number
  ): void {
    const beforeList = narratives.filter((narrative) => {
      return narrative.event == event;
    });

    if (beforeList.length == 0) {
      console.log("empty narrative, nothing to do here");
      if (nextGamedefinitionID) {
        this.nextMatch(nextGamedefinitionID);
      }
      
      return;
    }

    const sorted = beforeList.sort((a, b) => {
      return a.sortOrder - b.sortOrder;
    });

    const data = <NarrativeDialogData>{
      event: event,
      narratives: sorted,
      next: nextGamedefinitionID,
    };

    const dialogRef = this.dialog.open(NarrativeDialogComponent, {
      data: data,
    });

    const self = this;
    dialogRef.afterClosed().subscribe(() => {
      if (event == NARRATIVE_EVENT_END) {
        self.nextMatch(data.next);
      }
    });
  }

  // Find available match for the requested gamedefinition
  nextMatch(nextGamedefinitionID: number) {
    if (nextGamedefinitionID) {
      this.api
        .privateAvailableMatchPublicGet()
        .subscribe((matches: ModelAvailableMatch[]) => {
          const match = matches.find(
            (match) => match.gameDefinitionID == nextGamedefinitionID
          );

          if (match) {
            const playRequest = <ModelPlayRequest>{
              availableMatchID: match.id,
              teamID: 0,
            };

            this.api.privatePlayPost(playRequest).subscribe(
              (match: ModelMatch) => {
                // force refresh when changing only the id
                this.router.routeReuseStrategy.shouldReuseRoute = function () {
                  return false;
                };
                this.router.navigate(["watch", match.id]);
              },
              (error) => {
                this.router.navigate(["home"]);
                console.log("error", error);
              }
            );
          } else {
            this.router.navigate(["home"]);
            console.error(
              "No available match found for gamedefinition",
              nextGamedefinitionID
            );
          }
        });
    } else {
      this.router.navigate(["home"]);
    }
  }
}
