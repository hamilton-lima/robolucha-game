import { Injectable } from "@angular/core";

// @see https://github.com/hamilton-lima/vaca5/blob/master/lib/ js

export class Color {
  name: string;
  color: string;
}

@Injectable({
  providedIn: "root"
})
export class NMSColor {
  VINE_TOMATO = "#EF5026";
  EGGPLANT = "#3C3755";
  RED_PEPPER = "#C52728";
  PURPLE_CABBAGE = "#8E4980";
  BROCCOLI = "#2C401B";
  BRUSSELS_SPROUTS = "#86A23E";
  POTATO = "#D79851";
  RHUBARB = "#C15866";
  APPLE = "#E5493D";
  OKRA = "#5E7434";
  JICAMA = "#CB726E";
  FENNEL = "#CBC7A1";
  LEMON = "#FAF599";
  APRICOT = "#FFBE30";
  AVOCADO = "#C9C561";
  BLUEBERRY = "#353535";
  SOUR_CHERRY = "#AF1317";
  BEET = "#D73C2A";
  ASPERAGUS = "#C6BD62";
  WATERCRESS = "#9FB43B";
  TANGERINE = "#FAA21D";
  BANANA = "#FDDF6F";
  SPRING_ONION = "#702C23";
  PEAR = "#C8C846";
  CHARD = "#547838";
  FIG = "#68281F";
  GOLDEN_KIWI = "#F6D063";
  YELLOW_BELLPEPPER = "#FDC647";
  SQUASH_BLOSSOM = "#ECCC55";
  RED_KIDNEY_BEAN = "#CB9274";
  SQUASH = "#FBE70E";
  MUSCAT_GRAPES = "#AD709A";
  RED_BELLPEPPER = "#D12728";
  CARROT = "#E75F25";
  GREEN_CABBAGE = "#B4C346";
  PINEAPPLE = "#E2A528";
  DRAGON_FRUIT = "#C9A62E";
  ZUCCHINI = "#93A13F";
  KALE = "#47642E";
  CUCUMBER = "#456033";
  PEACH = "#F47747";
  FIDDLEHEAD = "#597A41";
  PURPLE_CAULIFLOWER = "#753C67";
  CARAMBOLA = "#E1B828";
  PAPAYA = "#EFAE20";
  LONG_BEAN = "#8A9E6D";
  STRAWBERRY = "#D62D28";
  TURNIP = "#B64885";
  RADISH = "#B32225";
  ARTICHOKE = "#879C3D";
  BUTTER_SQUASH = "#ECB481";
  MANGOSTEEN = "#9A1C1F";

  allColors : Array<Color> = [];

  constructor() {
    const self = this;
    Object.keys(this).forEach(key => {
      if (typeof self[key] === "string") {
        const color = self[key];
        const item: Color = {
          name: self.buildColorLabel(key),
          color: color
        };
        self.allColors.push(item);
      }
    });
  }

  buildColorLabel(colorName: string) {
    let lower = colorName.toLowerCase();
    let words = lower.split("_");
    let result = "";
    words.forEach(word => {
      result += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    });
    return result;
  }

  getColorName(color: string) {
    const found = this.allColors.find( item =>{
      return item.color == color;
    });

    return found ? found.name : "";
  }
}
