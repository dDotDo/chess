import { GameViewHandlers } from '../../../components/Game/GameView.types';
import { Coordinate } from '../../../utils/board/board.types';
import { PiecePlacements } from '../../../utils/board/boardEditor';

/* eslint-disable prettier/prettier */
export const coordinates: Coordinate[] = [
  'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
  'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8',
  'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
  'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
  'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8',
  'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8',
  'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
];

export const emptyBoardHandlers: GameViewHandlers = {
  handleNewGame: () => undefined,
  handleGameOver: () => undefined,
}

export default {
  pieceRenderConcisePositions: [
    {
      'wn': ['a1', 'e4'],
      'wb': ['e1', 'd4'],
      'bn': ['c7', 'd3'],
      'bb': ['f1', 'h8'],
    },
    {
      'bq': ['f2'],
      'bk': ['h7', 'h8'],
      'wp': ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8'],
      'wk': ['b1', 'b2'],
    },
    {
      'br': ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
      'wr': ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
    },
  ],
  squareHighlightData: [
    // in this case, concisePosition must have only one piece and one square
    {
      concisePosition: { 'wk': 'e4' },
      highlightSquares: ['d3', 'e3', 'f3', 'd4', 'f4', 'd5', 'e5', 'f5'],
    }
  ] as { concisePosition: PiecePlacements, highlightSquares: Coordinate[] }[],
};
