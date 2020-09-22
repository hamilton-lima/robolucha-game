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
import { ModelGameComponent } from './modelGameComponent';
import { ModelGameDefinition } from './modelGameDefinition';
import { ModelTeamParticipant } from './modelTeamParticipant';


export interface ModelMatch {
    availableMatchID?: number;
    gameDefinition?: ModelGameDefinition;
    gameDefinitionID?: number;
    id?: number;
    lastTimeAlive?: string;
    participants?: Array<ModelGameComponent>;
    teamParticipants?: Array<ModelTeamParticipant>;
    timeEnd?: string;
    timeStart?: string;
}
