import {
  BLACK,
  ForEach,
  Line,
  Opacity,
  remapValue,
} from '@bitmapland/react-bitmap-utils';
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
  }) => (
    <Opacity opacity={remapValue(zoom, MIN_ZOOM, MAX_ZOOM - 0.5, 0, 1)}>
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
  )
);

Grid.displayName = 'Grid';
