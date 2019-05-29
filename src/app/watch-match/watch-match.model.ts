export interface Luchador {
  id: number;
  name: string;
  x: number;
  y: number;
  life: number;
  angle: number;
  gunAngle: number;
  fireCoolDown: number;
  k: number;
  d: number;
  score: number;
  lastOnfound: number;
}

export interface Bullet {
  id: number;
  owner: number;
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

export interface MessageEnvelope {
  type: string;
  message: any;
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
