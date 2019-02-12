import { Helper3D } from './helper3d';
import * as BABYLON from 'babylonjs';
import { reject } from 'q';

export class Random3D {
  mesh: Promise<BABYLON.AbstractMesh>;

  constructor(mesh: Promise<BABYLON.AbstractMesh>) {
    this.mesh = mesh;
  }

  add(minX, maxX, minZ, maxZ, amount): Promise<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      return this.mesh.then(mesh => {
        let extra = mesh.clone('extra.0', null);
        const rangeZ = [minZ, maxZ];
        const rangeX = [minX, maxX];
        const rangeAngle = [0, 360];
        for (let x = 1; x <= amount; x++) {
          extra = mesh.clone('extra.' + x, null);
          extra.isVisible = true;
          extra.position.y = 0;
          extra.position.x =
            rangeX[0] + Math.abs(rangeX[1] - rangeX[0]) * Math.random();
          extra.position.z =
            rangeZ[0] - Math.abs(rangeZ[1] - rangeZ[0]) * Math.random();
          extra.rotation.z = Helper3D.angle2radian(
            rangeAngle[0] +
            Math.abs(rangeAngle[1] - rangeAngle[0]) * Math.random()
          );
        }
      })
        .then(() => {
          resolve();
        })
        .catch(function (error) {
          console.error('Error Generating random 3D elements', error);
        });
    }).catch(function (error) {
      console.error('Error finishing the the 3D element generation', error);
      reject();
    });
  }

}
