import * as BABYLON from 'babylonjs';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';

export class Square3D {
  private mesh: BABYLON.AbstractMesh;
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
  loading: Promise<BABYLON.AbstractMesh>;

  public constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.loading = this.loadMesh();
  }

  loadMesh() {
    const self = this;
    return new Promise<BABYLON.AbstractMesh>((resolve, reject) => {
      BABYLON.SceneLoader.ImportMeshAsync(
        '',
        'assets/',
        '182x275_wallPiece.babylon',
        self.scene
      ).then(
        (value: {
          meshes: BABYLON.AbstractMesh[];
          particleSystems: BABYLON.IParticleSystem[];
          skeletons: BABYLON.Skeleton[];
          animationGroups: BABYLON.AnimationGroup[];
        }) => {
          value.meshes.forEach(mesh => {
            if (mesh.name === '182x275_wallPiece') {
              self.mesh = mesh;
            }
          });
          self.mesh.isVisible = false;
          resolve(self.mesh);
        }
      );
    });
  }
}
