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
import { MainCode } from './mainCode';
import { MainGameComponent } from './mainGameComponent';
import { MainSceneComponent } from './mainSceneComponent';


export interface MainGameDefinition {
    arenaHeight?: number;
    arenaWidth?: number;
    buletSpeed?: number;
    bulletSize?: number;
    codes?: Array<MainCode>;
    description?: string;
    duration?: number;
    energy?: number;
    fireEnergyCost?: number;
    fps?: number;
    gameComponents?: Array<MainGameComponent>;
    id?: number;
    increaseSpeedEnergyCost?: number;
    increaseSpeedPercentage?: number;
    label?: string;
    life?: number;
    luchadorSize?: number;
    maxFireAmount?: number;
    maxFireCooldown?: number;
    maxFireDamage?: number;
    maxParticipants?: number;
    minFireAmount?: number;
    minFireDamage?: number;
    minParticipants?: number;
    moveSpeed?: number;
    name?: string;
    punchAngle?: number;
    punchCoolDown?: number;
    punchDamage?: number;
    radarAngle?: number;
    radarRadius?: number;
    recycledLuchadorEnergyRestore?: number;
    respawnAngle?: number;
    respawnCooldown?: number;
    respawnGunAngle?: number;
    respawnX?: number;
    respawnY?: number;
    restoreEnergyperSecond?: number;
    sceneComponents?: Array<MainSceneComponent>;
    sortOrder?: number;
    suggestedCodes?: Array<MainCode>;
    turnGunSpeed?: number;
    turnSpeed?: number;
    type?: string;
}
