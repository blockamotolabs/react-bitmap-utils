import { BLACK, ForEach, Line } from '@bitmapland/react-bitmap-utils';
import React, { memo } from 'react';

import { BLOCK_SIZE, BLOCKS_PER_COLUMN, BLOCKS_PER_ROW } from './constants';

export const EpochSeparators = memo(
  ({ countEpochs, scale }: { countEpochs: number; scale: number }) => (
    <ForEach start={1} end={countEpochs}>
      {({ index }) => (
        <Line
          key={index}
          startX={index * BLOCKS_PER_ROW * BLOCK_SIZE}
          startY={0}
          endX={index * BLOCKS_PER_ROW * BLOCK_SIZE}
          endY={BLOCKS_PER_COLUMN * BLOCK_SIZE}
          stroke={BLACK}
          // We do some fancy scaling here so that the epoch separators always stand out from block borders, but aren't too thick/thin when zoomed out
          strokeWidth={2 / scale + Math.cos(scale) * 4}
        />
      )}
    </ForEach>
  )
);

EpochSeparators.displayName = 'EpochSeparators';
