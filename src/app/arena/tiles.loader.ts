import * as BABYLON from "babylonjs";
import { MeshLoader } from "./mesh.loader";

export class TilesLoader {
  readonly tiles = [
    {
      name: "east",
      fileName: "3DTile_borderEast.babylon",
      meshName: "3DTile_borderEast"
    },
    {
      name: "north",
      fileName: "3DTile_borderNorth.babylon",
      meshName: "3DTile_borderNorth"
    },
    {
      name: "south",
      fileName: "3DTile_borderSouth.babylon",
      meshName: "3DTile_borderSouth"
    },
    {
      name: "west",
      fileName: "3DTile_borderWest.babylon",
      meshName: "3DTile_borderWest"
    },
    {
      name: "north-east",
      fileName: "3DTile_cornerNortheast.babylon",
      meshName: "3DTile_cornerNortheast"
    },
    {
      name: "north-west",
      fileName: "3DTile_cornerNorthwest.babylon",
      meshName: "3DTile_cornerNorthwest"
    },
    {
      name: "south-east",
      fileName: "3DTile_cornerSoutheast.babylon",
      meshName: "3DTile_cornerSoutheast"
    },
    {
      name: "south-west",
      fileName: "3DTile_cornerSouthwest.babylon",
      meshName: "3DTile_cornerSouthwest"
    },
    {
      name: "center",
      fileName: "3DTile_squareCenter_land.babylon",
      meshName: "3DTile_squareCenter_land"
    }
  ];

  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
  loading: Promise<string[]>;
  private meshes = {};
  private readonly tilesFolder = "tiles";

  public constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    const promises = [];

    // load all tiles with all dummy markers on it
    this.tiles.forEach(tile => {
      const promise = MeshLoader.loadAllMeshes(
        scene,
        this.tilesFolder + "/" + tile.fileName,
        tile.meshName,
        false
      ).then((loadedMeshes: BABYLON.AbstractMesh[]) => {
        // the list includes the mesh to be rendered and dummy meshes
        // that defines respawn position
        this.meshes[tile.name] = loadedMeshes;
        return tile.name;
      });

      promises.push(promise);
    });

    this.loading = Promise.all(promises);
  }

  getTileDimension(): BABYLON.Vector3 {
    let center: BABYLON.AbstractMesh;
    // find center tile
    const tile = this.tiles.find(tile => {
      return tile.name == "center";
    });

    // find center mesh
    this.meshes["center"].forEach(mesh => {
      if (mesh.name == tile.meshName) {
        center = mesh;
      }
    });

    const dimensions = center.getBoundingInfo().boundingBox.extendSize;
    return dimensions;
  }
}
