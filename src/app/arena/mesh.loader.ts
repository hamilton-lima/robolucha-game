import * as BABYLON from 'babylonjs';

export class MeshLoader {
  public static loadVisible(scene: BABYLON.Scene, fileName: string, meshName: string) {
    return MeshLoader.load(scene, fileName, meshName, true);
  }

  public static load(scene: BABYLON.Scene, fileName: string, meshName: string, visible = false) {
    const self = this;
    return new Promise<BABYLON.AbstractMesh>((resolve, reject) => {
      BABYLON.SceneLoader.ImportMeshAsync('', 'assets/', fileName, scene).then(
        (value: {
          meshes: BABYLON.AbstractMesh[];
          particleSystems: BABYLON.IParticleSystem[];
          skeletons: BABYLON.Skeleton[];
          animationGroups: BABYLON.AnimationGroup[];
        }) => {

          console.log('MeshLoader', fileName, meshName, value);
          let result: BABYLON.AbstractMesh;
          value.meshes.forEach(mesh => {
            if (mesh.name === meshName) {
              result = mesh;
            }
          });
          if (result) {
            result.isVisible = visible;
            resolve(result);
          } else {
            reject('Mesh not found: ' + meshName);
          }
        }
      );
    });
  }
}