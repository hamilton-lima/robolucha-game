// @see https://github.com/hamilton-lima/vaca5/blob/master/lib/ js
export class NMSColor {
  static VINE_TOMATO = "#EF5026";
  static EGGPLANT = "#3C3755";
  static RED_PEPPER = "#C52728";
  static PURPLE_CABBAGE = "#8E4980";
  static BROCCOLI = "#2C401B";
  static BRUSSELS_SPROUTS = "#86A23E";
  static POTATO = "#D79851";
  static RHUBARB = "#C15866";
  static APPLE = "#E5493D";
  static OKRA = "#5E7434";
  static JICAMA = "#CB726E";
  static FENNEL = "#CBC7A1";
  static LEMON = "#FAF599";
  static APRICOT = "#FFBE30";
  static AVOCADO = "#C9C561";
  static BLUEBERRY = "#353535";
  static SOUR_CHERRY = "#AF1317";
  static BEET = "#D73C2A";
  static ASPERAGUS = "#C6BD62";
  static WATERCRESS = "#9FB43B";
  static TANGERINE = "#FAA21D";
  static BANANA = "#FDDF6F";
  static SPRING_ONION = "#702C23";
  static PEAR = "#C8C846";
  static CHARD = "#547838";
  static FIG = "#68281F";
  static GOLDEN_KIWI = "#F6D063";
  static YELLOW_BELLPEPPER = "#FDC647";
  static SQUASH_BLOSSOM = "#ECCC55";
  static RED_KIDNEY_BEAN = "#CB9274";
  static SQUASH = "#FBE70E";
  static MUSCAT_GRAPES = "#AD709A";
  static RED_BELLPEPPER = "#D12728";
  static CARROT = "#E75F25";
  static GREEN_CABBAGE = "#B4C346";
  static PINEAPPLE = "#E2A528";
  static DRAGON_FRUIT = "#C9A62E";
  static ZUCCHINI = "#93A13F";
  static KALE = "#47642E";
  static CUCUMBER = "#456033";
  static PEACH = "#F47747";
  static FIDDLEHEAD = "#597A41";
  static PURPLE_CAULIFLOWER = "#753C67";
  static CARAMBOLA = "#E1B828";
  static PAPAYA = "#EFAE20";
  static LONG_BEAN = "#8A9E6D";
  static STRAWBERRY = "#D62D28";
  static TURNIP = "#B64885";
  static RADISH = "#B32225";
  static ARTICHOKE = "#879C3D";
  static BUTTER_SQUASH = "#ECB481";
  static MANGOSTEEN = "#9A1C1F";

  static allColors = [];

  static init() {
    if (NMSColor.allColors.length == 0) {
      for (var x in NMSColor) {
        if (typeof NMSColor[x] === "string") {
          const color = <Color>{
            name: NMSColor.buildColorLabel(x),
            color: NMSColor[x]
          };
          NMSColor.allColors.push(color);
        }
      }
    }
  }

  static buildColorLabel(colorName: string) {
    let lower = colorName.toLowerCase();
    let words = lower.split("_");
    let result = "";
    words.forEach(word => {
      result += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    });
    return result;
  }
}

export class Color {
  name: string;
  color: string;
}

NMSColor.init();
