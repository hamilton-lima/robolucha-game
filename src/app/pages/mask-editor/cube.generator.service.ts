import { Injectable } from "@angular/core";
import * as jspdf from "jspdf";
import { MaskEditorMediator } from "./mask-editor.mediator";
import { TextureBuilder } from "src/app/arena/texture-builder";

@Injectable({
  providedIn: "root",
})
export class CubeGeneratorService {
  constructor(
    private mediator: MaskEditorMediator,
    private textureBuilder: TextureBuilder
  ) {}

  generate(name: string) {
    this.textureBuilder
      .loadImageFromFileName("assets/cube.png", "cube")
      .subscribe((image) => {
        let pdf = new jspdf("l", "cm", "a4");

        pdf.addImage(image, "PNG", 1, 1, 25, 17);

        const canvas = this.mediator.mask.value;
        if (canvas) {
          const png = canvas.toDataURL("image/png");
          pdf.addImage(png, "PNG", 1, 2, 5, 5);
        }

        pdf.setFontSize(10);
        pdf.setFon;
        pdf.text(7, 1.5, "game.robolucha.com - play with us", "left");

        pdf.save(name + ".pdf");
      });
  }
}
