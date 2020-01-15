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
import { ModelClassroom } from './modelClassroom';
import { ModelUser } from './modelUser';
import { ModelUserSetting } from './modelUserSetting';


export interface ModelUserDetails {
    classrooms?: Array<ModelClassroom>;
    roles?: Array<string>;
    settings?: ModelUserSetting;
    user?: ModelUser;
}
