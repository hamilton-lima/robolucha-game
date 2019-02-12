import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";

// from https://www.babylonjs-playground.com/#2EYZPE
export class Helper3D {

  static readonly ANGLE2RADIAN = Math.PI / 180;
  public static angle2radian(angle: number): number {
    return angle * Helper3D.ANGLE2RADIAN;
  }

  public static addLabelToMesh(
    mesh: BABYLON.Mesh,
    text: string,
    linkOffsetY: number,
    textColor: BABYLON.Color3
  ) {
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var rect1 = new GUI.Rectangle();
    rect1.width = 0.05;
    rect1.height = "40px";
    rect1.color = textColor.toHexString();
    rect1.thickness = 0;
    rect1.background = null;
    advancedTexture.addControl(rect1);

    var label = new GUI.TextBlock();
    label.text = text;
    rect1.addControl(label);

    rect1.linkWithMesh(mesh);
    rect1.linkOffsetY = linkOffsetY;
  }

  public static showAxis(scene, size) {
    var makeTextPlane = function(text, color, size) {
      var dynamicTexture = new BABYLON.DynamicTexture(
        "DynamicTexture",
        50,
        scene,
        true
      );
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(
        text,
        5,
        40,
        "bold 36px Arial",
        color,
        "transparent",
        true
      );

      let plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
      plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
      plane.material.backFaceCulling = false;

      return plane;
    };

    var axisX = BABYLON.Mesh.CreateLines(
      "axisX",
      [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ],
      scene
    );
    axisX.color = new BABYLON.Color3(1, 0, 0);
    Helper3D.addLabelToMesh(axisX, "X", 0, axisX.color);

    // var xChar = makeTextPlane("X", "red", size / 10);
    // xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

    var axisY = BABYLON.Mesh.CreateLines(
      "axisY",
      [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
      ],
      scene
    );
    axisY.color = new BABYLON.Color3(0, 1, 0);
    Helper3D.addLabelToMesh(axisY, "Y", 0, axisY.color);

    var axisZ = BABYLON.Mesh.CreateLines(
      "axisZ",
      [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
      ],
      scene
    );
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    Helper3D.addLabelToMesh(axisZ, "Z", 0, axisZ.color);
  }


}
