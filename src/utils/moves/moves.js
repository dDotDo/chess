import { produce } from 'immer';
import {
  getCastlingPosition,
  getPieceAtSquare,
  matchingSquares,
  validateSquare,
  getKingSquare,
  files,
} from '../board';
import { flipColor } from '../pieces';
import { excludeOccupiedSquares, isSquareAttacked } from './utils';
import { DevError } from '../errors';
import config from '../../config/config';

import kingMove from './king';
import queenMove from './queen';
import rookMove from './rook';
import bishopMove from './bishop';
import knightMove from './knight';
import pawnMove from './pawn';

const piecesNeedExcludeLogic = new Set(['k', 'n', 'p']);

export function getPieceLegalMoves(board, square, piece) {
  if (!piece) piece = getPieceAtSquare(board, square);
  const candidates = computeCandidateSquares[piece.type](
    square,
    board,
    piece.color
  );

  if (!piecesNeedExcludeLogic.has(piece.type)) return candidates;
  return excludeOccupiedSquares(candidates, board, piece.color);
}

const computeCandidateSquares = {
  k: kingMove,
  q: queenMove,
  r: rookMove,
  b: bishopMove,
  n: knightMove,
  p: pawnMove,
};

const backRank = {
  w: config.get('board.dimensions.numberRanks'),
  b: 1,
};
const promotionPieces = ['q', 'r', 'b', 'n'];
export function makeMove(board, start, end) {
  validateSquare(start);
  validateSquare(end);

  let piece = getPieceAtSquare(board, start);
  if (!piece)
    throw new DevError(`No piece at start square ${JSON.stringify(start)}`);

  return produce(board, (draft) => {
    // this order is neccessary
    draft[end.rank][end.file] = piece;
    handleSpecialCases(board, draft, piece, { start, end });
    draft[start.rank][start.file] = undefined;
    handleChecks(board, draft, piece.color);
  });
}

function handleSpecialCases(board, draft, piece, squares) {
  handleEnPassant(board, draft, piece, squares);
  handlePawnPromotion(draft, piece, squares.end);
  handleCastling(board, draft, piece, squares.end);
  handleCastlingPiecesMoved(board, draft, piece, squares.start);
  handleKingMoved(draft, piece, squares.end);
}

function handleEnPassant(board, draft, piece, squares) {
  const { start, end } = squares;

  let isEnPassantSquare;
  let capturedEnPassant;
  if (piece.type === 'p') {
    isEnPassantSquare = Math.abs(end.rank - start.rank) === 2;
    capturedEnPassant =
      start.file !== end.file && getPieceAtSquare(board, end) === undefined;
  }

  if (capturedEnPassant) {
    const { rank, file } = draft[0].enPassantSquare;
    draft[rank][file] = undefined;
  }
  draft[0].enPassantSquare = isEnPassantSquare ? end : undefined;
}

function handlePawnPromotion(draft, piece, end) {
  if (piece.type !== 'p') return;

  if (end.rank === backRank[piece.color])
    draft[end.rank][end.file] = promotePawn(piece.color);
}

function promotePawn(color) {
  let promotionPiece;
  do {
    promotionPiece = prompt(`Promote to: (${promotionPieces.join(', ')})`);
  } while (!promotionPieces.includes(promotionPiece));

  return { type: promotionPiece, color };
}

function handleCastling(board, draft, piece, end) {
  if (piece.type !== 'k') return;
  const castling = board[0].castling[piece.color];
  if (!castling.k) return;

  const castlingSquares = getCastlingPosition(piece.color);
  const isQueensideSquare = matchingSquares(end, castlingSquares.q.k);
  const isKingsideSquare = matchingSquares(end, castlingSquares.k.k);
  if (!isQueensideSquare && !isKingsideSquare) return;
  if (!castling.side.q && !castling.side.k) return;

  const side = isKingsideSquare ? 'k' : 'q';
  const rookSquare = castlingSquares[side].r;
  const oldRookSquare = castlingSquares[side].rFormer;
  draft[rookSquare.rank][rookSquare.file] = { type: 'r', color: piece.color };
  draft[oldRookSquare.rank][oldRookSquare.file] = undefined;

  draft[0].castling[piece.color].k = false;
  draft[0].castling[piece.color].side.q = false;
  draft[0].castling[piece.color].side.k = false;
}

function handleCastlingPiecesMoved(board, draft, piece, start) {
  if (piece.type === 'k') draft[0].castling[piece.color].k = false;

  if (piece.type !== 'r') return;
  const rookCastlingState = board[0].castling[piece.color].side;

  if (rookCastlingState.q && start.file === files.first) {
    draft[0].castling[piece.color].side.q = false;
  }
  if (rookCastlingState.k && start.file === files.last) {
    draft[0].castling[piece.color].side.k = false;
  }
}

function handleChecks(board, draft, enemyColor) {
  const kingColor = flipColor(enemyColor);
  const kingSquare = getKingSquare(board, kingColor);

  const isKingChecked = isSquareAttacked(kingSquare, draft, kingColor);
  if (!isKingChecked) return;
  draft[0].king.checkedSide = kingColor;
}

function handleKingMoved(draft, piece, endSquare) {
  if (piece.type !== 'k') return;
  draft[0].king[piece.color].square = endSquare;
}
