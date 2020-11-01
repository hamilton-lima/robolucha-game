export const enum CurrentEditorEnum {
  BasicInfo,
  Codes,
  SingleSceneComponent,
  SuggestedCode,
  GameComponent
}

export class PartialModelGameDefinition {
  arenaHeight?: number;
  arenaWidth?: number;
  description?: string;
  duration?: number;
  label?: string;
  maxParticipants?: number;
  minParticipants?: number;
  name?: string;
}