import * as BABYLON from "babylonjs";
import { Single3D } from "./single3D";
import { Square3D } from "./square3D";
import { Random3D } from "./random3D";
import { GroundTile3D } from "./ground-tile3D";
import { Wall3D } from "./wall3D";
import { Helper3D } from "./helper3d";
import { GameDefinition } from "../watch-match/watch-match.model";
import { SharedConstants } from "./shared.constants";
import { TilesLoader } from "./tiles.loader";
import { count } from "rxjs/operators";
import { Box3D } from "./box3d";
import { TreesLoader } from "./trees.loader";

export interface ICenterTilesInfo {
  start: BABYLON.Vector3;
  centerTilesHorizontal: number;
  centerTilesVertical: number;
}

export class SceneBuilder {
  ground: BABYLON.Mesh;

  constructor(
    private scene: BABYLON.Scene,
    private gameDefinition: GameDefinition
  ) {}

  // TODO: load lights from camera_and_light.babylon
  build() {
    return Promise.all([
      this.composeGround(),
      this.composeWalls(),
      this.addExtras()
    ]);
  }

  // createBaseLayer() {
  //   return new Promise<void>((resolve, reject) => {
  //     const multiplier = 10;
  //     const groundWidth =
  //       this.convertPosition(
  //         this.gameDefinition.arenaWidth + this.gameDefinition.luchadorSize
  //       ) * multiplier;

  //     const groundHeight =
  //       this.convertPosition(
  //         this.gameDefinition.arenaHeight + this.gameDefinition.luchadorSize
  //       ) * multiplier;

  //     this.ground = BABYLON.MeshBuilder.CreateGround(
  //       "ground1",
  //       { width: groundWidth, height: groundHeight, subdivisions: 16 },
  //       this.scene
  //     );

  //     // // console.log("ground dimensions", groundWidth, groundHeight);

  //     this.ground.position.x = -5; // groundWidth / 2 * -1;
  //     this.ground.position.z = -5; // groundHeight / 2 * -1;
  //     this.ground.position.y = -0.1;

  //     // // console.log(
  //     //   "ground dimensions",
  //     //   groundWidth,
  //     //   groundHeight,
  //     //   this.ground.position
  //     // );

  //     const material = new BABYLON.StandardMaterial(
  //       "ground-material",
  //       this.scene
  //     );
  //     material.diffuseColor = BABYLON.Color3.FromHexString("#619FD7"); // BABYLON.Color3.Random();
  //     this.ground.material = material;
  //     resolve();
  //   });
  // }

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
      const wall = new Single3D(this.scene);

      wall.loading.then(mesh => {
        const wall = mesh;

        const meshWidth = 0.5;
        const meshHeight = 1.15;

        // bottom
        for (let x = 0; x < width; x += meshWidth) {
          const iTop = wall.clone("bottom-wall-" + x, null);
          iTop.position.x = x;
          iTop.position.y = 0;
          iTop.position.z = 0;
          iTop.isVisible = true;
        }

        // top
        for (let x = 0; x < width; x += meshWidth) {
          const iTop = wall.clone("top-wall-" + x, null);
          iTop.position.x = x;
          iTop.position.y = 0;
          iTop.position.z = height + meshHeight;
          iTop.isVisible = true;
        }

        // left
        let lastZ = 0;
        for (let z = 0; z <= height + meshHeight; z += meshHeight) {
          const iTop = wall.clone("left-wall-" + z, null);
          iTop.position.x = -meshWidth;
          iTop.position.y = 0;
          iTop.position.z = z;
          iTop.isVisible = true;

          const iTop2 = wall.clone("left2-wall-" + z, null);
          iTop2.position.x = -2 * meshWidth;
          iTop2.position.y = 0;
          iTop2.position.z = z;
          iTop2.isVisible = true;

          lastZ = z;
        }

        const topLeft = wall.clone("top-left-wall", null);
        topLeft.position.x = -meshWidth;
        topLeft.position.y = 0;
        topLeft.position.z = lastZ + meshHeight;
        topLeft.isVisible = true;

        const topLeft2 = wall.clone("top-left-wall", null);
        topLeft2.position.x = -2 * meshWidth;
        topLeft2.position.y = 0;
        topLeft2.position.z = lastZ + meshHeight;
        topLeft2.isVisible = true;

        // right
        for (let z = 0; z <= height + meshHeight; z += meshHeight) {
          const iTop = wall.clone("left-wall-" + z, null);
          iTop.position.x = width;
          iTop.position.y = 0;
          iTop.position.z = z;
          iTop.isVisible = true;

          const iTop2 = wall.clone("left2-wall-" + z, null);
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
      const tiles: TilesLoader = new TilesLoader(this.scene);
      const trees: TreesLoader = new TreesLoader(this.scene);
      const wall = new Single3D(this.scene);

      Promise.all([tiles.loading, wall.loading, trees.loading]).then(loaded => {
        // console.log("loaded ", loaded);

        const dimension = tiles.getTileDimension();
        const centerTileInfo = this.getCenterTileInfo(
          dimension,
          wall.getDimension()
        );
        const center = tiles.getMesh("center");
        let spawnPositions: Array<BABYLON.Vector3> = [];

        this.positionCenterTiles(dimension, centerTileInfo, center);
        this.addCorners(tiles, centerTileInfo, dimension, spawnPositions);
        this.addHorizontalTiles(
          tiles,
          centerTileInfo,
          dimension,
          spawnPositions
        );
        this.addVerticalTiles(tiles, centerTileInfo, dimension, spawnPositions);
        this.drawTrees(spawnPositions, trees);
        resolve();
      });
    });
  }

  drawTrees(spawnPositions: BABYLON.Vector3[], treesLoader: TreesLoader) {
    const trees: Array<BABYLON.AbstractMesh> = [];
    trees.push(treesLoader.getMesh("coconut"));
    trees.push(treesLoader.getMesh("oak"));
    trees.push(treesLoader.getMesh("pine"));
    let pos = 0;

    spawnPositions.forEach(point => {
      const showTree = Math.random() > 0.25;

      if (showTree) {
        const tree = trees[pos++].clone("clone-tree", null);
        tree.position.x = point.x;
        tree.position.y = point.y;
        tree.position.z = point.z;
        tree.scaling.y = 0.6 + 0.4 * Math.random();
        tree.rotation.y = Helper3D.angle2radian(360 * Math.random());
        tree.isVisible = true;

        if (pos >= trees.length) {
          pos = 0;
        }
      }
    });
  }

  addHorizontalTiles(
    tiles: TilesLoader,
    info: ICenterTilesInfo,
    tileDimension: BABYLON.Vector3,
    spawnPositions: Array<BABYLON.Vector3>
  ) {
    const north = tiles.getMesh("north");
    const south = tiles.getMesh("south");

    const northSpawnPoints = tiles.getSpawnPositions("north");
    const southSpawnPoints = tiles.getSpawnPositions("south");

    let x = info.start.x;
    const y = info.start.y;
    const z = info.start.z - tileDimension.z;
    const zTop = info.start.z + info.centerTilesVertical * tileDimension.z;

    for (let xn = 0; xn < info.centerTilesHorizontal; xn++) {
      let northCloned = north.clone("north-clone-", null);
      northCloned.position.x = x;
      northCloned.position.y = y;
      northCloned.position.z = zTop;
      northCloned.isVisible = true;

      this.addSpawnPoints(
        spawnPositions,
        northSpawnPoints,
        northCloned.position
      );

      let southCloned = south.clone("south-clone-", null);
      southCloned.position.x = x;
      southCloned.position.y = y;
      southCloned.position.z = z;
      southCloned.isVisible = true;

      this.addSpawnPoints(
        spawnPositions,
        southSpawnPoints,
        southCloned.position
      );

      x = x + tileDimension.x;
    }
  }

  addVerticalTiles(
    tiles: TilesLoader,
    info: ICenterTilesInfo,
    tileDimension: BABYLON.Vector3,
    spawnPositions: Array<BABYLON.Vector3>
  ) {
    const west = tiles.getMesh("west");
    const east = tiles.getMesh("east");

    const westSpawnPoints = tiles.getSpawnPositions("west");
    const eastSpawnPoints = tiles.getSpawnPositions("east");

    const x = info.start.x - tileDimension.x;
    const xEast = info.start.x + info.centerTilesHorizontal * tileDimension.x;
    const y = info.start.y;
    let z = info.start.z;

    for (let zn = 0; zn < info.centerTilesVertical; zn++) {
      let westCloned = west.clone("west-clone-", null);
      westCloned.position.x = x;
      westCloned.position.y = y;
      westCloned.position.z = z;
      westCloned.isVisible = true;

      this.addSpawnPoints(spawnPositions, westSpawnPoints, westCloned.position);

      let eastCloned = east.clone("east-clone-", null);
      eastCloned.position.x = xEast;
      eastCloned.position.y = y;
      eastCloned.position.z = z;
      eastCloned.isVisible = true;

      this.addSpawnPoints(spawnPositions, eastSpawnPoints, eastCloned.position);

      z = z + tileDimension.z;
    }
  }

  addCorners(
    tiles: TilesLoader,
    info: ICenterTilesInfo,
    tileDimension: BABYLON.Vector3,
    spawnPositions: Array<BABYLON.Vector3>
  ) {
    const southWest = tiles.getMesh("south-west");
    southWest.position.x = info.start.x - tileDimension.x;
    southWest.position.y = info.start.y;
    southWest.position.z = info.start.z - tileDimension.z;
    southWest.isVisible = true;

    this.addSpawnPoints(
      spawnPositions,
      tiles.getSpawnPositions("south-west"),
      southWest.position
    );

    const northWest = tiles.getMesh("north-west");
    northWest.position.x = info.start.x - tileDimension.x;
    northWest.position.y = info.start.y;
    northWest.position.z =
      info.start.z + info.centerTilesVertical * tileDimension.z;
    northWest.isVisible = true;

    this.addSpawnPoints(
      spawnPositions,
      tiles.getSpawnPositions("north-west"),
      northWest.position
    );

    const northEast = tiles.getMesh("north-east");
    northEast.position.x =
      info.start.x + info.centerTilesHorizontal * tileDimension.x;
    northEast.position.y = info.start.y;
    northEast.position.z =
      info.start.z + info.centerTilesVertical * tileDimension.z;
    northEast.isVisible = true;

    this.addSpawnPoints(
      spawnPositions,
      tiles.getSpawnPositions("north-east"),
      northEast.position
    );

    const southEast = tiles.getMesh("south-east");
    southEast.position.x =
      info.start.x + info.centerTilesHorizontal * tileDimension.x;
    southEast.position.y = info.start.y;
    southEast.position.z = info.start.z - tileDimension.z;
    southEast.isVisible = true;

    this.addSpawnPoints(
      spawnPositions,
      tiles.getSpawnPositions("south-east"),
      southEast.position
    );
  }

  // adds input points to the result list transforming with the
  // position that is the source tile position.
  addSpawnPoints(
    spawnPositions: BABYLON.Vector3[],
    input: BABYLON.Vector3[],
    position: BABYLON.Vector3
  ) {
    input.forEach(point => {
      spawnPositions.push(point.add(position));
    });
  }

  getCenterTileInfo(
    tileDimension: BABYLON.Vector3,
    wallDimension: BABYLON.Vector3
  ): ICenterTilesInfo {
    const xWalls = wallDimension.x * 2;
    const zWalls = wallDimension.z * 2;

    const arenaWidth =
      this.convertPosition(this.gameDefinition.arenaWidth) + xWalls;
    const arenaHeight =
      this.convertPosition(this.gameDefinition.arenaHeight) + zWalls;

    // console.log("arena dimensions converted to 3D", arenaWidth, arenaHeight);
    // console.log("dimensions", tileDimension);

    const centerTilesHorizontal = Math.floor(arenaWidth / tileDimension.x) + 1;
    const centerTilesVertical = Math.floor(arenaHeight / tileDimension.z) + 1;
    // console.log("count", centerTilesHorizontal, centerTilesVertical);

    const xShift = (centerTilesHorizontal * tileDimension.x - arenaWidth) / 2;
    const zShift = (centerTilesVertical * tileDimension.z - arenaHeight) / 2;

    const alignX = tileDimension.x / 2;
    const alignZ = tileDimension.z / 2;

    // let start = <BABYLON.Vector3>{
    //   x: alignX - xShift,
    //   z: (alignZ + zShift) * -1,
    //   y: 0.0
    // };

    let start = <BABYLON.Vector3>{
      x: alignX - xShift,
      z: alignZ - zShift,
      y: 0.0
    };

    let result = <ICenterTilesInfo>{
      start: start,
      centerTilesHorizontal: centerTilesHorizontal,
      centerTilesVertical: centerTilesVertical
    };

    return result;
  }

  positionCenterTiles(
    dimension: BABYLON.Vector3,
    centerTileInfo: ICenterTilesInfo,
    center: BABYLON.AbstractMesh
  ) {
    let x = centerTileInfo.start.x;
    const y = centerTileInfo.start.y;

    for (let xn = 0; xn < centerTileInfo.centerTilesHorizontal; xn++) {
      let z = centerTileInfo.start.z;

      for (let zn = 0; zn < centerTileInfo.centerTilesVertical; zn++) {
        // console.log("center-clone", xn, zn);
        let clonedCenterTile = center.clone("center-clone-", null);
        clonedCenterTile.position.x = x;
        clonedCenterTile.position.y = y;
        clonedCenterTile.position.z = z;
        clonedCenterTile.isVisible = true;
        z = z + dimension.z;
      }
      x = x + dimension.x;
    }
  }

  convertPosition(n: number) {
    const result: number =
      n *
      (SharedConstants.LUCHADOR_MODEL_WIDTH / this.gameDefinition.luchadorSize);

    return result;
  }
}
