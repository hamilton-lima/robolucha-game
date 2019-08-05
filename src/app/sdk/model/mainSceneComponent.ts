/**
 * Robolucha API
 * Robolucha API
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ModelCode } from './mainCode';


export interface ModelSceneComponent {
    alpha?: number;
    blockMovement?: boolean;
    codes?: Array<ModelCode>;
    colider?: boolean;
    color?: string;
    gameDefinition?: number;
    height?: number;
    id?: number;
    respawn?: boolean;
    rotation?: number;
    showInRadar?: boolean;
    type?: string;
    width?: number;
    x?: number;
    y?: number;
}
