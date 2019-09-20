import * as BABYLON from "babylonjs";
import { MeshLoader } from "./mesh.loader";

export class TreesLoader {
  readonly allTrees = ["coconut", "oak", "pine"];
  
  readonly tiles = [
    {
      name: "coconut",
      fileName: "coconutTree.babylon",
      meshName: "coconutTree"
    },
    {
      name: "oak",
      fileName: "oakTree.babylon",
      meshName: "oakTree"
    },
    {
      name: "pine",
      fileName: "pineTree.babylon",
      meshName: "pineTree"
    }
  ];

  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
  loading: Promise<string[]>;
  private meshes = {};
  private readonly tilesFolder = "props_trees";

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
        // console.log("this.meshes", this.meshes);
        return tile.name;
      });

      promises.push(promise);
    });

    this.loading = Promise.all(promises);
  }

  getTileDimensionByTileName(name: string): BABYLON.Vector3 {
    let center = this.getMesh(name);
    // console.log("center", center.getBoundingInfo());
    const box = center.getBoundingInfo().boundingBox;
    const size = box.maximum.subtract(box.minimum);
    return size;
  }

  getMesh(name: string): BABYLON.AbstractMesh {
    let result: BABYLON.AbstractMesh = null;

    // find tile
    const tile = this.tiles.find(tile => {
      return tile.name == name;
    });

    if (tile == null) {
      console.error("tile name not found", name);
      return result;
    }

    this.meshes[name].forEach(mesh => {
      if (mesh.name == tile.meshName) {
        result = mesh.clone();
      }
    });

    if (result == null) {
      console.error("mesh name not found in tile", name, tile.meshName);
    }

    return result;
  }
}
