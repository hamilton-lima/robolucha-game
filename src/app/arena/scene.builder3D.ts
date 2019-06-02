import * as BABYLON from 'babylonjs';
import { Single3D } from './single3D';
import { Square3D } from './square3D';
import { Random3D } from './random3D';
import { GroundTile3D } from './ground-tile3D';
import { Wall3D } from './wall3D';
import { Helper3D } from './helper3d';
import { GameDefinition } from '../watch-match/watch-match.model';
import { SharedConstants } from './shared.constants';

export class SceneBuilder {

    ground: BABYLON.Mesh;

    constructor(private scene: BABYLON.Scene, private gameDefinition: GameDefinition) {

    }

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
                'ground1',
                { width: groundWidth, height: groundHeight, subdivisions: 16 },
                this.scene
            );

            console.log('ground dimensions', groundWidth, groundHeight);

            this.ground.position.x = -5; // groundWidth / 2 * -1;
            this.ground.position.z = -5; // groundHeight / 2 * -1;
            this.ground.position.y = -0.1;

            console.log(
                'ground dimensions',
                groundWidth,
                groundHeight,
                this.ground.position
            );

            const material = new BABYLON.StandardMaterial('ground-material', this.scene);
            material.diffuseColor = BABYLON.Color3.FromHexString('#619FD7'); // BABYLON.Color3.Random();
            this.ground.material = material;
            resolve();
        });
    }


    composeGround() {
        return new Promise<void>((resolve, reject) => {

            const groundWidth = this.convertPosition(this.gameDefinition.arenaWidth);
            const groundHeight = this.convertPosition(this.gameDefinition.arenaHeight);
            const tileSize = 2;

            let otherTile = new BABYLON.StandardMaterial("otherr-tile", this.scene);
            otherTile.diffuseTexture = new BABYLON.Texture("assets/floor_L_color.png", this.scene);
            let counter = 0;

            const ground = new GroundTile3D(this.scene);
            ground.loading.then(mesh => {
                const tiles = [];
                for (let x = 0; x <= groundWidth; x += tileSize) {
                    for (let z = 0; z <= groundHeight; z += tileSize) {
                        const i = mesh.clone('tile-' + x + '.' + z, null);
                        i.isVisible = true;
                        i.position.x = x;
                        i.position.y = 0;
                        i.position.z = z;
                        if (counter++ % 2 > 0) {
                            i.material = otherTile;
                        }
                    }
                }

                console.log('>>> ground loaded');
                resolve();
            });
        });
    }

    composeWalls() {
        return new Promise<void>((resolve, reject) => {

            const width = this.convertPosition(this.gameDefinition.arenaWidth);
            const height = this.convertPosition(this.gameDefinition.arenaHeight);

            const wall = new Wall3D(this.scene);
            wall.loading.then(mesh => {
                const meshX = 2.49;
                const meshZ = 1.15;

                const bottomZ = -meshX;
                const topZ = height + meshX * 1.5;
                const topRotation = Helper3D.angle2radian(90);
                const bottomRotation = Helper3D.angle2radian(270);
                const verticalStep = meshZ;
                const maxZ = height + verticalStep;

                const leftX = -meshX;
                const rightX = width + meshX * 1.5;
                const rightRotation = Helper3D.angle2radian(180);
                const horizontalStep = meshZ;
                const maxX = width + horizontalStep;

                for (let x = 0; x < maxX; x += horizontalStep) {
                    const iTop = mesh.clone('wall-' + x + '.' + topZ, null);
                    iTop.position.x = x + meshZ;
                    iTop.position.y = 0;
                    iTop.position.z = topZ;
                    iTop.rotation.y = topRotation;
                    iTop.isVisible = true;

                    const iBottom = mesh.clone('wall-' + x + '.' + bottomZ, null);
                    iBottom.position.x = x;
                    iBottom.position.y = 0;
                    iBottom.position.z = bottomZ;
                    iBottom.rotation.y = bottomRotation;
                    iBottom.isVisible = true;
                }

                for (let z = 0; z < maxZ; z += verticalStep) {
                    const iLeft = mesh.clone('wall-' + leftX + '.' + z, null);
                    iLeft.position.x = leftX;
                    iLeft.position.y = 0;
                    iLeft.position.z = z + meshZ;
                    iLeft.isVisible = true;

                    const iRight = mesh.clone('wall-' + rightX + '.' + z, null);
                    iRight.position.x = rightX;
                    iRight.position.y = 0;
                    iRight.position.z = z;
                    iRight.rotation.y = rightRotation;
                    iRight.isVisible = true;
                }
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
        const result: number = n / this.gameDefinition.luchadorSize 
            * SharedConstants.LUCHADOR_MODEL_WIDTH;
        return result;
    }

}
