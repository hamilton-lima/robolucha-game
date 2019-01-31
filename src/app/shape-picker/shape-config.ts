import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ShapeConfig {
  path = "assets/shapes/";

  maskShape = [
    "segunda_cor0001.png",
    "segunda_cor0002.png",
    "segunda_cor0003.png",
    "segunda_cor0004.png",
    "segunda_cor0005.png",
    "segunda_cor0006.png",
    "segunda_cor0007.png",
    "segunda_cor0008.png",
    "segunda_cor0009.png",
    "segunda_cor0010.png",
    "segunda_cor0011.png",
    "segunda_cor0012.png",
    "segunda_cor0013.png",
    "segunda_cor0014.png",
    "segunda_cor0015.png"
  ];

  ornamentTop = [
    "ornamento_cima0001.png",
    "ornamento_cima0002.png",
    "ornamento_cima0003.png",
    "ornamento_cima0004.png",
    "ornamento_cima0005.png",
    "ornamento_cima0006.png",
    "ornamento_cima0007.png",
    "ornamento_cima0008.png",
    "ornamento_cima0009.png",
    "ornamento_cima0010.png",
    "ornamento_cima0011.png"
  ];

  ornamentBottom = [
    "ornamento_baixo0001.png",
    "ornamento_baixo0002.png",
    "ornamento_baixo0003.png",
    "ornamento_baixo0004.png",
    "ornamento_baixo0005.png",
    "ornamento_baixo0006.png",
    "ornamento_baixo0007.png",
    "ornamento_baixo0008.png",
    "ornamento_baixo0009.png",
    "ornamento_baixo0010.png"
  ];

  face = [
    "rosto0001.png",
    "rosto0002.png",
    "rosto0003.png",
    "rosto0004.png",
    "rosto0005.png",
    "rosto0006.png",
    "rosto0007.png",
    "rosto0008.png",
    "rosto0009.png",
    "rosto0010.png"
  ];

  mouth = [
    "boca0001.png",
    "boca0002.png",
    "boca0003.png",
    "boca0004.png",
    "boca0005.png",
    "boca0006.png",
    "boca0007.png",
    "boca0008.png",
    "boca0009.png",
    "boca0010.png",
    "boca0011.png",
    "boca0012.png",
    "boca0013.png",
    "boca0014.png",
    "boca0015.png",
    "boca0016.png",
    "boca0017.png",
    "boca0018.png",
    "boca0019.png",
    "boca0020.png"
  ];

  eyes = [
    "olho0001.png",
    "olho0002.png"
  ];

  images: Array<Array<string>>;
  constructor(){
    this.images = [];
    this.images['mask.shape'] = this.maskShape;
    this.images['mask.decoration.top.shape'] = this.ornamentTop;
    this.images['mask.decoration.bottom.shape'] = this.ornamentBottom;
    this.images['face.shape'] = this.face;
    this.images['mouth.shape'] = this.mouth;
    this.images['eyes.shape'] = this.eyes;
  }
}
