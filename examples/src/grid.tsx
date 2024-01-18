import {
  BLACK,
  ForEach,
  Line,
  Opacity,
  remapValue,
} from '@blockamotolabs/react-bitmap-utils';
import React, { memo } from 'react';

import {
  BLOCK_SIZE,
  BLOCKS_PER_COLUMN,
  BLOCKS_PER_ROW,
  MAX_ZOOM,
  MIN_ZOOM,
} from './constants';

export const Grid = memo(
  ({
    countEpochs,
    zoom,
    scale,
  }: {
    countEpochs: number;
    zoom: number;
    scale: number;
  }) => {
    const visibleAfter = MIN_ZOOM + 0.01;

    // Don't render the grid if we're zoomed out too far
    if (zoom < visibleAfter) {
      return null;
    }

    return (
      <Opacity
        opacity={remapValue(zoom, visibleAfter, MAX_ZOOM - 0.5, 0, 1, true)}
      >
        <ForEach end={countEpochs * BLOCKS_PER_ROW}>
          {({ index }) => (
            <Line
              key={index}
              startX={index * BLOCK_SIZE}
              startY={0}
              endX={index * BLOCK_SIZE}
              endY={BLOCKS_PER_COLUMN * BLOCK_SIZE}
              stroke={BLACK}
              strokeWidth={1 / scale}
            />
          )}
        </ForEach>
        <ForEach end={BLOCKS_PER_COLUMN}>
          {({ index }) => (
            <Line
              key={index}
              startX={0}
              startY={index * BLOCK_SIZE}
              endX={countEpochs * BLOCKS_PER_ROW * BLOCK_SIZE}
              endY={index * BLOCK_SIZE}
              stroke={BLACK}
              strokeWidth={1 / scale}
            />
          )}
        </ForEach>
      </Opacity>
    );
  }
);

Grid.displayName = 'Grid';
