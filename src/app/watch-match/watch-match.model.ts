export interface LuchadorState {
  id: number;
  name: string;
  x: number;
  y: number;
  life: number;
  angle: number;
  gunAngle: number;
  fireCoolDown: number;
  headColor: string;
  bodyColor: string;
  k: number;
  d: number;
  score: number;
}

export interface Mask {
  background: string;
  backgroundColor: string;
  background2: string;
  background2Color: string;
  ornamentTop: string;
  ornamentTopColor: string;
  ornamentBottom: string;
  ornamentBottomColor: string;
  face: string;
  faceColor: string;
  mouth: string;
  mouthColor: string;
  eye: string;
  eyeColor: string;
}

export interface Luchador {
  state: LuchadorState;
  name: string;
  mask: Mask;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  amount: number;
}

export interface Score {
  id: number;
  name: string;
  k: number;
  d: number;
  score: number;
}

export interface MatchState {
  events: any[];
  bullets: Bullet[];
  punches: any[];
  luchadores: Luchador[];
  scores: Score[];
  clock: number;
}

export interface GameDefinition {
    id?: number;
    name?: string;
    duration?: number;
    minParticipants?: number;
    maxParticipants?: number;
    arenaWidth: number;
    arenaHeight: number;
    bulletSize: number;
    luchadorSize: number;
    fps?: number;
    buletSpeed?: number;
}