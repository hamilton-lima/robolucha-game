import { Injectable } from "@angular/core";
import * as jspdf from "jspdf";
import { MaskEditorMediator } from "./mask-editor.mediator";
import { TextureBuilder } from "src/app/arena/texture-builder";

interface BoxPosition {
  name: string;
  colorName: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

@Injectable({
  providedIn: "root",
})
export class CubeGeneratorService {
  constructor(
    private mediator: MaskEditorMediator,
    private textureBuilder: TextureBuilder
  ) {}

  marginX = 2;
  marginY = 2;

  boxes: BoxPosition[] = [
    {
      x: 4.083,
      y: 0.031,
      width: 5.624,
      height: 3.357,
      name: "top",
      colorName: "#ff9955",
    },
    {
      x: 0.771,
      y: 3.388,
      width: 3.312,
      height: 7.892,
      name: "1",
      colorName: "#ff9955",
    },
    {
      x: 4.083,
      y: 3.388,
      width: 5.639,
      height: 6.142,
      name: "2-top",
      colorName: "#ff9955",
    },
    {
      x: 4.083,
      y: 9.509,
      width: 1.098,
      height: 1.771,
      name: "2-left",
      colorName: "#ff9955",
    },
    {
      x: 8.624,
      y: 9.509,
      width: 1.098,
      height: 1.771,
      name: "2-right",
      colorName: "#ff9955",
    },
    {
      x: 9.722,
      y: 3.388,
      width: 3.312,
      height: 7.892,
      name: "3",
      colorName: "#ff9955",
    },
    {
      x: 13.034,
      y: 3.388,
      width: 5.639,
      height: 6.142,
      name: "4-top",
      colorName: "#ff9955",
    },
    {
      x: 13.034,
      y: 9.509,
      width: 1.098,
      height: 1.771,
      name: "4-left",
      colorName: "#ff9955",
    },
    {
      x: 17.575,
      y: 9.509,
      width: 1.098,
      height: 1.771,
      name: "4-right",
      colorName: "#ff9955",
    },
  ];

  generate(name: string) {
    this.textureBuilder
      .loadImageFromFileName("assets/box2.png", "cube")
      .subscribe((image) => {
        let pdf = new jspdf("l", "cm", "a4");

        // const canvas = this.mediator.mask.value;
        // if (canvas) {
        //   const png = canvas.toDataURL("image/png");
        //   pdf.addImage(png, "PNG", this.marginX, this.marginY);
        // }

        pdf.setFontSize(10);
        pdf.text(7, 1.5, "game.robolucha.com - play with us", "left");

        this.boxes.forEach((box) => {
          pdf.setFillColor(box.colorName);
          pdf.rect(
            this.marginX + box.x,
            this.marginY + box.y,
            box.width,
            box.height,
            "F"
          );
        });

        pdf.addImage(image, "PNG", this.marginX, this.marginY, 18.682, 11.311);

        pdf.save(name + ".pdf");
      });
  }
}
