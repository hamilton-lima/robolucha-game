import { Injectable } from "@angular/core";
import * as jspdf from "jspdf";
import { MaskEditorMediator } from "./mask-editor.mediator";
import { TextureBuilder } from "src/app/arena/texture-builder";

interface Dimension {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BoxPosition {
  name: string;
  colorName: string;
  dimension: Dimension;
}

@Injectable({
  providedIn: "root",
})
export class CubeGeneratorService {
  constructor(
    private mediator: MaskEditorMediator,
    private textureBuilder: TextureBuilder
  ) {}

  boxes: BoxPosition[] = [
    {
      name: "top",
      colorName: "mask.primary.color",
      dimension: {
        x: 4.083,
        y: 0.031,
        width: 5.624,
        height: 3.357,
      },
    },
    {
      name: "1",
      colorName: "mask.primary.color",
      dimension: {
        x: 0.771,
        y: 3.388,
        width: 3.312,
        height: 7.892,
      },
    },
    {
      name: "1-leg",
      colorName: "skin.color",
      dimension: { x: 0.771, y: 9.509, width: 3.312, height: 1.771 },
    },
    {
      name: "2-top",
      colorName: "mask.primary.color",
      dimension: { x: 4.083, y: 3.388, width: 5.639, height: 6.142 },
    },
    {
      name: "2-left",
      colorName: "skin.color",
      dimension: {
        x: 4.083,
        y: 9.509,
        width: 1.098,
        height: 1.771,
      },
    },
    {
      name: "2-right",
      colorName: "skin.color",
      dimension: { x: 8.624, y: 9.509, width: 1.098, height: 1.771 },
    },
    {
      name: "3",
      colorName: "mask.primary.color",
      dimension: { x: 9.722, y: 3.388, width: 3.312, height: 7.892 },
    },
    {
      name: "3-leg",
      colorName: "skin.color",
      dimension: { x: 9.722, y: 9.509, width: 3.312, height: 1.771 },
    },
    {
      name: "4-top",
      colorName: "mask.primary.color",
      dimension: { x: 13.034, y: 3.388, width: 5.639, height: 6.142 },
    },
    {
      name: "4-left",
      colorName: "skin.color",
      dimension: { x: 13.034, y: 9.509, width: 1.098, height: 1.771 },
    },
    {
      name: "4-right",
      colorName: "skin.color",
      dimension: { x: 17.575, y: 9.509, width: 1.098, height: 1.771 },
    },
  ];

  marginX = 2;
  marginY = 2;

  colorsX = 21.345;
  colorsY = 3.451;
  colorsYStep = 0.5;

  mask: Dimension = { x: 3.816, y: 2.118, width: 6.284, height: 7.391 };

  defaultColor = "#FFFFFF";

  getListOfColorNames(): string[] {
    const result: string[] = [];
    const configs = this.mediator.configs.value;
    configs.forEach((config) => {
      if (config.key.endsWith(".name")) {
        result.push(config.value);
      }
    });

    return result;
  }

  generate(name: string) {
    this.textureBuilder
      .loadImageFromFileName("assets/box2.png", "cube")
      .subscribe((image) => {
        let pdf = new jspdf("l", "cm", "a4");

        pdf.setFontSize(30);
        pdf.text(
          this.marginX + 1,
          this.marginY + 12.526,
          "https://game.robolucha.com",
          "left"
        );
        const configs = this.mediator.configs.value;

        this.boxes.forEach((box) => {
          // gets color from configuration
          const color = this.textureBuilder.getValue(
            configs,
            box.colorName,
            this.defaultColor
          );

          pdf.setFillColor(color);
          pdf.rect(
            this.marginX + box.dimension.x,
            this.marginY + box.dimension.y,
            box.dimension.width,
            box.dimension.height,
            "F"
          );
        });

        const canvas = this.mediator.mask.value;
        if (canvas) {
          const png = canvas.toDataURL("image/png");
          pdf.addImage(
            png,
            "PNG",
            this.marginX + this.mask.x,
            this.marginY + this.mask.y,
            this.mask.width,
            this.mask.height
          );
        }

        pdf.addImage(image, "PNG", this.marginX, this.marginY, 18.682, 11.311);

        pdf.setFontSize(14);
        pdf.setFontType("bold");

        pdf.text(
          this.colorsX,
          this.colorsY,
          "List of ingredient colors",
          "left"
        );

        pdf.setFontSize(11);
        pdf.setFontType("normal");

        const startY = this.colorsY + 2 * this.colorsYStep;
        const colors = this.getListOfColorNames();
        let line = 0;
        colors.forEach((color) => {
          pdf.text(
            this.colorsX,
            startY + line * this.colorsYStep,
            color,
            "left"
          );
          line++;
        });

        pdf.save(name + ".pdf");
      });
  }
}
