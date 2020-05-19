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
import { ModelGameDefinition } from './modelGameDefinition';
import { ModelSkill } from './modelSkill';


export interface ModelActivity {
    description?: string;
    gameDefinition?: ModelGameDefinition;
    gameDefinitionID?: number;
    id?: number;
    name?: string;
    skills?: Array<ModelSkill>;
    sourceName?: string;
    sourceURL?: string;
}