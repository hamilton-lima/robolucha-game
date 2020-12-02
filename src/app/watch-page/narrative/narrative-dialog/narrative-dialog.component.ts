import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ModelNarrativeDefinition } from "src/app/sdk";

export interface NarrativeDialogData {
  event: string;
  narratives: ModelNarrativeDefinition[];
}

@Component({
  selector: "app-narrative-dialog",
  templateUrl: "./narrative-dialog.component.html",
  styleUrls: ["./narrative-dialog.component.scss"],
})
export class NarrativeDialogComponent implements OnInit {
  position = 0;

  constructor(
    public dialogRef: MatDialogRef<NarrativeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NarrativeDialogData
  ) {}

  ngOnInit(): void {
    console.log("send page event here");
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  back() {
    if (this.position - 1 < 0) {
      this.position = 0;
    } else {
      this.position--;
    }
  }

  next() {
    if (this.position + 1 >= this.data.narratives.length) {
      this.dialogRef.close();
    } else {
      this.position++;
    }
  }
}
