import { ForEach, Opacity, Text, WHITE } from '@bitmapland/react-bitmap-utils';
import React, { memo } from 'react';

import { BLOCK_SIZE, BLOCK_WINDOW_SIZE } from './constants';
import { getBlockOpacity, getIndexFromCoords } from './utils';

const Block = ({
  countTotalBlocks,
  x,
  y,
}: {
  countTotalBlocks: number;
  x: number;
  y: number;
}) => {
  const index = getIndexFromCoords(x, y);

  // Don't draw blocks outside of the available blocks
  if (index < 0 || index > countTotalBlocks) {
    return null;
  }

  return (
    <Text
      x={(x + 0.5) * BLOCK_SIZE}
      y={(y + 0.5) * BLOCK_SIZE}
      fontSize={20}
      textAlign="center"
      verticalAlign="middle"
      fill={WHITE}
    >
      {index}
    </Text>
  );
};

export const BlockNumbers = memo(
  ({
    zoom,
    location,
    countTotalBlocks,
  }: {
    zoom: number;
    countTotalBlocks: number;
    location: { x: number; y: number };
  }) => {
    // We only want to begin drawing individual blocks once we're zoomed in
    // Drawing 800k+ blocks would be super slow
    // We're going to select an area around the center of the screen to draw block numbers
    const windowStartX =
      Math.floor(location.x / BLOCK_SIZE) - BLOCK_WINDOW_SIZE * 0.5;
    const windowStartY =
      Math.floor(location.y / BLOCK_SIZE) - BLOCK_WINDOW_SIZE * 0.5;
    const windowEndX = windowStartX + BLOCK_WINDOW_SIZE;
    const windowEndY = windowStartY + BLOCK_WINDOW_SIZE;

    const opacity = getBlockOpacity(zoom);

    // If we're not zoomed in enough, don't draw anything
    if (!opacity) {
      return null;
    }

    return (
      <Opacity opacity={opacity}>
        <ForEach start={windowStartX} end={windowEndX}>
          {({ index: x }) => (
            <ForEach key={x} start={windowStartY} end={windowEndY}>
              {({ index: y }) => (
                <Block
                  key={`${x},${y}`}
                  countTotalBlocks={countTotalBlocks}
                  x={x}
                  y={y}
                />
              )}
            </ForEach>
          )}
        </ForEach>
      </Opacity>
    );
  }
);

BlockNumbers.displayName = 'BlockNumbers';
