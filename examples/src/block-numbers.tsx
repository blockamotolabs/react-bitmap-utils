import {
  clamp,
  Coordinates,
  ForEach,
  Opacity,
  Text,
  WHITE,
} from '@blockamotolabs/react-bitmap-utils';
import React, { memo } from 'react';

import {
  BLOCK_SIZE,
  BLOCK_WINDOW_SIZE,
  BLOCK_WINDOW_SIZE_ZOOMED,
  BLOCKS_PER_COLUMN,
  BLOCKS_PER_EPOCH,
  BLOCKS_PER_ROW,
  MIN_ZOOM,
} from './constants';
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
  const index = getIndexFromCoords({ x, y });

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
    location: Coordinates;
  }) => {
    const blockWindowSize =
      zoom > MIN_ZOOM + 0.6 ? BLOCK_WINDOW_SIZE_ZOOMED : BLOCK_WINDOW_SIZE;
    const countEpochs = Math.ceil(countTotalBlocks / BLOCKS_PER_EPOCH);
    const minX = 0;
    const minY = 0;
    const maxX = countEpochs * BLOCKS_PER_ROW;
    const maxY = BLOCKS_PER_COLUMN;
    // We only want to begin drawing individual blocks once we're zoomed in
    // Drawing 800k+ blocks would be super slow
    // We're going to select an area around the center of the screen to draw block numbers
    const windowStartX = clamp(
      Math.floor(location.x / BLOCK_SIZE) - blockWindowSize * 0.5,
      minX,
      maxX
    );
    const windowStartY = clamp(
      Math.floor(location.y / BLOCK_SIZE) - blockWindowSize * 0.5,
      minY,
      maxY
    );
    const windowEndX = clamp(windowStartX + blockWindowSize, minX, maxX);
    const windowEndY = clamp(windowStartY + blockWindowSize, minY, maxY);

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
