import { getSquareAtOffset, getPieceAtSquare } from '../board';

function getLegalSquaresInDirection(square, board, color, offsetDirection) {
  const squares = [];
  let currentSquare = square;
  const [offsetX, offsetY] = offsetDirection;
  let done = false;

  while (!done) {
    try {
      currentSquare = getSquareAtOffset(currentSquare, offsetX, offsetY);
      const currentSquarePiece = getPieceAtSquare(board, currentSquare);

      if (!currentSquarePiece) {
        squares.push(currentSquare);
        continue;
      }

      if (currentSquarePiece.color !== color) squares.push(currentSquare);
      done = true;
    } catch {
      done = true;
    }
  }

  return squares;
}

export { getLegalSquaresInDirection };
