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
import { ModelGameComponent } from './mainGameComponent';


export interface ModelMatch {
    gameDefinitionID?: number;
    id?: number;
    lastTimeAlive?: string;
    participants?: Array<ModelGameComponent>;
    timeEnd?: string;
    timeStart?: string;
}
