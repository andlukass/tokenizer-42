export type Cell = 'X' | 'O' | null;
export type Board = Cell[]; // always 9 elements: indices 0-8

export type GameStatus = 'won' | 'lost' | 'draw' | 'ongoing';

export interface PlayRequest {
  address: string;
  position: number; // 0-8
}

export interface PlayResponse {
  board: Board;
  status: GameStatus;
}
