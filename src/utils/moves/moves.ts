import { getCheckedSide } from '../board';
import {
  excludeNonCheckHandlingSquares,
  excludeCheckingSquares,
} from './checks';
import { excludeOccupiedSquares } from './utils';

import kingMove from './king';
import queenMove from './queen';
import rookMove from './rook';
import bishopMove from './bishop';
import knightMove from './knight';
import pawnMove from './pawn';
import { Board, BoardSquare } from '../board.types';
import { Piece } from '../pieces.types';

const piecesNeedExcludeLogic = new Set(['k', 'n', 'p']);

export { default as makeMove } from './makeMoves';
export function getPieceLegalMoves(board: Board, square: BoardSquare, piece: Piece) {
  const { state: boardState, position } = board;

  let candidates = computeCandidateSquares[piece.type](
    square,
    piece.color,
    position,
    boardState
  );

  if (getCheckedSide(boardState))
    candidates = excludeNonCheckHandlingSquares(candidates, boardState, piece);
  if (!piecesNeedExcludeLogic.has(piece.type)) return candidates;

  if (piece.type === 'k')
    candidates = excludeCheckingSquares(candidates, board, piece.color);
  return excludeOccupiedSquares(candidates, position, piece.color);
}

const computeCandidateSquares = {
  k: kingMove,
  q: queenMove,
  r: rookMove,
  b: bishopMove,
  n: knightMove,
  p: pawnMove,
};
