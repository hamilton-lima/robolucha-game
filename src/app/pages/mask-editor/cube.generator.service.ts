import { Injectable } from "@angular/core";
import * as jspdf from "jspdf";
import { MaskEditorMediator } from "./mask-editor.mediator";

@Injectable({
  providedIn: "root",
})
export class CubeGeneratorService {
  constructor(private mediator: MaskEditorMediator) {}

  generate() {
    let pdf = new jspdf("l", "cm", "a4");

    const canvas = this.mediator.mask.value;
    if (canvas) {
      const png = canvas.toDataURL("image/png");
      pdf.addImage(png, "PNG", 10, 5, 5, 5);
    }

    pdf.setFontSize(40);
    pdf.text(5, 5, "Paranyan loves jsPDF");

    pdf.save("Filename.pdf");
  }
}
