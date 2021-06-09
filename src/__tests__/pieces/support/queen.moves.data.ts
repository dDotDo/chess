import { createBoard } from '../../../utils/board/editor/boardEditor';
import { BoardAndMoves } from '../common.test.utils';

export const pureQueenPositionAndMoves: BoardAndMoves[] = [
  {
    board: createBoard({
      position: {
        wq: ['d5'],
      },
    }),
    testPieceSquare: 'd5',
    expectedMoves: [
      'd1',
      'h1',
      'a2',
      'd2',
      'g2',
      'b3',
      'd3',
      'f3',
      'c4',
      'd4',
      'e4',
      'e5',
      'f5',
      'g5',
      'h5',
      'c5',
      'b5',
      'a5',
      'c6',
      'd6',
      'e6',
      'b7',
      'd7',
      'f7',
      'a8',
      'd8',
      'g8',
    ],
  },
  {
    board: createBoard({
      position: {
        bq: ['d5'],
      },
      state: { turn: 'b' },
    }),
    testPieceSquare: 'd5',
    expectedMoves: [
      'd1',
      'h1',
      'a2',
      'd2',
      'g2',
      'b3',
      'd3',
      'f3',
      'c4',
      'd4',
      'e4',
      'e5',
      'f5',
      'g5',
      'h5',
      'c5',
      'b5',
      'a5',
      'c6',
      'd6',
      'e6',
      'b7',
      'd7',
      'f7',
      'a8',
      'd8',
      'g8',
    ],
  },
];

export const rangeBlockedPositionsAndMoves: BoardAndMoves[] = [
  {
    board: createBoard({
      position: {
        bp: ['b1', 'd1', 'e2', 'c3', 'g3', 'a6', 'h7', 'd6'],
        wq: ['d3'],
      },
    }),
    testPieceSquare: 'd3',
    expectedMoves: [
      'b1',
      'd1',
      'e2',
      'c2',
      'd2',
      'c3',
      'g3',
      'e3',
      'f3',
      'c4',
      'e4',
      'd4',
      'b5',
      'f5',
      'd5',
      'a6',
      'g6',
      'd6',
      'h7',
    ],
  },
  {
    board: createBoard({
      position: {
        wp: ['b1', 'd1', 'e2', 'c3', 'g3', 'a6', 'h7', 'd6'],
        bq: ['d3'],
      },
      state: { turn: 'b' },
    }),
    testPieceSquare: 'd3',
    expectedMoves: [
      'b1',
      'd1',
      'e2',
      'c2',
      'd2',
      'c3',
      'g3',
      'e3',
      'f3',
      'c4',
      'e4',
      'd4',
      'b5',
      'f5',
      'd5',
      'a6',
      'g6',
      'd6',
      'h7',
    ],
  },
  {
    board: createBoard({
      position: {
        wp: ['f1', 'c2', 'd2', 'b3', 'g3', 'c4', 'd6', 'g6'],
        wq: ['d3'],
      },
    }),
    testPieceSquare: 'd3',
    expectedMoves: ['e2', 'c3', 'e3', 'f3', 'd4', 'e4', 'd5', 'f5'],
  },
  {
    board: createBoard({
      position: {
        bp: ['f1', 'c2', 'd2', 'b3', 'g3', 'c4', 'd6', 'g6'],
        bq: ['d3'],
      },
      state: { turn: 'b' },
    }),
    testPieceSquare: 'd3',
    expectedMoves: ['e2', 'c3', 'e3', 'f3', 'd4', 'e4', 'd5', 'f5'],
  },
];
