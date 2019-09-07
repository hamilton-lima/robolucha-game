import * as BABYLON from "babylonjs";
import { Single3D } from "./single3D";
import { Square3D } from "./square3D";
import { Random3D } from "./random3D";
import { GroundTile3D } from "./ground-tile3D";
import { Wall3D } from "./wall3D";
import { Helper3D } from "./helper3d";
import { GameDefinition } from "../watch-match/watch-match.model";
import { SharedConstants } from "./shared.constants";

export class SceneBuilder {
  ground: BABYLON.Mesh;

  constructor(
    private scene: BABYLON.Scene,
    private gameDefinition: GameDefinition
  ) {}

  // TODO: load lights from camera_and_light.babylon
  build() {
    return Promise.all([
      this.createBaseLayer(),
      this.composeGround(),
      this.composeWalls(),
      this.addExtras()
    ]);
  }

  createBaseLayer() {
    return new Promise<void>((resolve, reject) => {
      const multiplier = 10;
      const groundWidth =
        this.convertPosition(
          this.gameDefinition.arenaWidth + this.gameDefinition.luchadorSize
        ) * multiplier;

      const groundHeight =
        this.convertPosition(
          this.gameDefinition.arenaHeight + this.gameDefinition.luchadorSize
        ) * multiplier;

      this.ground = BABYLON.MeshBuilder.CreateGround(
        "ground1",
        { width: groundWidth, height: groundHeight, subdivisions: 16 },
        this.scene
      );

      // // console.log("ground dimensions", groundWidth, groundHeight);

      this.ground.position.x = -5; // groundWidth / 2 * -1;
      this.ground.position.z = -5; // groundHeight / 2 * -1;
      this.ground.position.y = -0.1;

      // // console.log(
      //   "ground dimensions",
      //   groundWidth,
      //   groundHeight,
      //   this.ground.position
      // );

      const material = new BABYLON.StandardMaterial(
        "ground-material",
        this.scene
      );
      material.diffuseColor = BABYLON.Color3.FromHexString("#619FD7"); // BABYLON.Color3.Random();
      this.ground.material = material;
      resolve();
    });
  }

  composeGround() {
    return new Promise<void>((resolve, reject) => {
      const groundWidth = this.convertPosition(this.gameDefinition.arenaWidth);
      const groundHeight = this.convertPosition(
        this.gameDefinition.arenaHeight
      );
      const tileSize = 2;

      let otherTile = new BABYLON.StandardMaterial("otherr-tile", this.scene);
      otherTile.diffuseTexture = new BABYLON.Texture(
        "assets/floor_L_color.png",
        this.scene
      );
      let counter = 0;

      const ground = new GroundTile3D(this.scene);
      ground.loading.then(mesh => {
        const tiles = [];
        for (let x = 0; x <= groundWidth; x += tileSize) {
          for (let z = 0; z <= groundHeight; z += tileSize) {
            const i = mesh.clone("tile-" + x + "." + z, null);
            i.isVisible = true;
            i.position.x = x;
            i.position.y = 0;
            i.position.z = z;
            if (counter++ % 2 > 0) {
              i.material = otherTile;
            }
          }
        }

        // console.log(">>> ground loaded");
        resolve();
      });
    });
  }

  composeWalls() {
    return new Promise<void>((resolve, reject) => {
      const width = this.convertPosition(this.gameDefinition.arenaWidth);
      const height = this.convertPosition(this.gameDefinition.arenaHeight);
      const square = new Square3D(this.scene);
      const wall = new Single3D(this.scene);

      Promise.all([wall.loading, square.loading])
      .then(meshes => {
        const wall = meshes[0];
        const square = meshes[1];

        const meshWidth = 0.5;
        const meshHeight = 1.15;

        // bottom
        for (let x = 0; x < width; x += meshWidth) {
            const iTop = wall.clone("bottom-wall-" + x , null);
            iTop.position.x = x;
            iTop.position.y = 0;
            iTop.position.z = 0;
            iTop.isVisible = true;
        }  

        // top
        for (let x = 0; x < width; x += meshWidth) {
            const iTop = wall.clone("top-wall-" + x , null);
            iTop.position.x = x;
            iTop.position.y = 0;
            iTop.position.z = height + meshHeight;
            iTop.isVisible = true;
        }  

        // left
        let lastZ = 0;
        for (let z = 0; z <= height + meshHeight; z += meshHeight) {
            const iTop = wall.clone("left-wall-" + z , null);
            iTop.position.x = -meshWidth;
            iTop.position.y = 0;
            iTop.position.z = z;
            iTop.isVisible = true;

            const iTop2 = wall.clone("left2-wall-" + z , null);
            iTop2.position.x = - 2*meshWidth;
            iTop2.position.y = 0;
            iTop2.position.z = z;
            iTop2.isVisible = true;

            lastZ = z;
        }  

        const topLeft = wall.clone("top-left-wall", null);
        topLeft.position.x = - meshWidth;
        topLeft.position.y = 0;
        topLeft.position.z = lastZ + meshHeight;
        topLeft.isVisible = true;

        const topLeft2 = wall.clone("top-left-wall", null);
        topLeft2.position.x = - 2 *meshWidth;
        topLeft2.position.y = 0;
        topLeft2.position.z = lastZ + meshHeight;
        topLeft2.isVisible = true;

        // right
        for (let z = 0; z <= height + meshHeight; z += meshHeight) {
            const iTop = wall.clone("left-wall-" + z , null);
            iTop.position.x = width;
            iTop.position.y = 0;
            iTop.position.z = z;
            iTop.isVisible = true;

            const iTop2 = wall.clone("left2-wall-" + z , null);
            iTop2.position.x = width + meshWidth;
            iTop2.position.y = 0;
            iTop2.position.z = z;
            iTop2.isVisible = true;

            lastZ = z;
        }  

        const topRight = wall.clone("top-left-wall", null);
        topRight.position.x = width;
        topRight.position.y = 0;
        topRight.position.z = lastZ + meshHeight;
        topRight.isVisible = true;

        const topRight2 = wall.clone("top-left-wall", null);
        topRight2.position.x = width + meshWidth;
        topRight2.position.y = 0;
        topRight2.position.z = lastZ + meshHeight;
        topRight2.isVisible = true;

        resolve();
      });
    });
  }


  addExtras() {
    return new Promise<void>((resolve, reject) => {
      const groundWidth = this.convertPosition(this.gameDefinition.arenaWidth);
      const single = new Single3D(this.scene);
      const square = new Square3D(this.scene);

      const randomizer = new Random3D(single.loading);
      const randomizerSquare = new Random3D(square.loading);

      Promise.all([
        randomizer.add(-6, groundWidth, -6, -10, 40),
        randomizerSquare.add(-6, groundWidth, -6, -10, 20)
      ]).then(() => {
        resolve();
      });
    });
  }

  convertPosition(n: number) {
    const result: number =
      n *
      (SharedConstants.LUCHADOR_MODEL_WIDTH / this.gameDefinition.luchadorSize);

    return result;
  }
}
