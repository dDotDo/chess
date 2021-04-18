import React from 'react';
import areObjectsEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import Piece from '../Pieces/Piece';
import config from '../../config/config';
import { validatePiece } from '../../utils/pieces';
import './Square.css';

const colorScheme = config.get('square.colors.default');

function Square(props) {
  const {
    light,
    containingPiece,
    square,
    highlighted,
    currentlyFocusedPiece,
    handlers,
  } = props;
  const color = colorScheme[light ? 'light' : 'dark'];
  validatePiece(containingPiece);

  function handleSquareClick() {
    if (highlighted) return handlers.movePiece(square);

    if (currentlyFocusedPiece || (!containingPiece && !highlighted))
      return handlers.removePieceFocus();

    handlers.setPieceFocus(containingPiece, square);
  }

  const squareStyle = { fill: color };
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className='square-wrapper' onClick={handleSquareClick}>
      <svg width='5vw' height='5vw' className='square-svg'>
        <rect width='5vw' height='5vw' style={squareStyle} />
      </svg>
      <PieceWrapper {...{ containingPiece }} />
      <SquareHighlight {...{ highlighted, currentlyFocusedPiece }} />
    </div>
  );
}
const squareIrrelevantProps = ['handlers', 'key', 'get', '__proto__'];
export default React.memo(Square, (oldProps, newProps) => {
  return areObjectsEqual(
    omit(oldProps, squareIrrelevantProps),
    omit(newProps, squareIrrelevantProps)
  );
});

function PieceWrapper(props) {
  const { containingPiece } = props;
  const { color, type } = containingPiece;

  if (!containingPiece) return null;
  return (
    <div className='piece-wrapper-outer'>
      <div className='piece-wrapper-inner'>
        <Piece {...{ type, color }} />
      </div>
    </div>
  );
}

function SquareHighlight(props) {
  const { highlighted, currentlyFocusedPiece } = props;
  const strokeColor = currentlyFocusedPiece ? 'red' : 'white';

  if (!highlighted && !currentlyFocusedPiece) return null;
  return (
    <div className='square-highlight-wrapper'>
      <svg height='4.5vw' width='4.5vw'>
        <rect
          height='4.5vw'
          width='4.5vw'
          stroke={strokeColor}
          strokeWidth='0.25vw'
          fill='transparent'
        />
      </svg>
    </div>
  );
}
