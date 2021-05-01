import { getPieceAtSquare, getCheckedSide } from '../board';
import { excludeNonCheckHandlingSquares } from './checks';
import { excludeOccupiedSquares } from './utils';

import kingMove from './king';
import queenMove from './queen';
import rookMove from './rook';
import bishopMove from './bishop';
import knightMove from './knight';
import pawnMove from './pawn';

const piecesNeedExcludeLogic = new Set(['k', 'n', 'p']);

export { default as makeMove } from './makeMoves';
export function getPieceLegalMoves(board, square, piece) {
  if (!piece) piece = getPieceAtSquare(board, square);
  let candidates = computeCandidateSquares[piece.type](
    square,
    board,
    piece.color
  );

  if (!piecesNeedExcludeLogic.has(piece.type)) return candidates;
  candidates = excludeOccupiedSquares(candidates, board, piece.color);
  if (getCheckedSide(board))
    return excludeNonCheckHandlingSquares(candidates, board, piece);
  return candidates;
}

const computeCandidateSquares = {
  k: kingMove,
  q: queenMove,
  r: rookMove,
  b: bishopMove,
  n: knightMove,
  p: pawnMove,
};
