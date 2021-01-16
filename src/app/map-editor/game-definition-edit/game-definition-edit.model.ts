import { ModelMedia } from "src/app/sdk";

export const enum CurrentEditorEnum {
  BasicInfo,
  Codes,
  SingleSceneComponent,
  SuggestedCode,
  GameComponent,
  Narrative,
}

export class PartialModelGameDefinition {
  arenaHeight?: number;
  arenaWidth?: number;
  description?: string;
  type?:string;
  duration?: number;
  label?: string;
  maxParticipants?: number;
  minParticipants?: number;
  name?: string;
  media?: ModelMedia;
  respawnX: number;
  respawnY: number;
  respawnAngle: number;
  respawnGunAngle: number;
}