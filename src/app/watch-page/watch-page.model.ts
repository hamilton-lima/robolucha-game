export interface TeamParticipant {
  teamID: number;
  minParticipants: number;
  maxParticipants: number;
  participants: number;
}

export interface MatchReady {
  ready: boolean;
  matchID: number;
  minParticipants: number;
  maxParticipants: number;
  participants: number;
  teamParticipants: TeamParticipant[];
}
