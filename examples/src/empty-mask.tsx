import { BLACK, Rectangle } from '@bitmapland/react-bitmap-utils';
import React, { memo } from 'react';

import {
  BLOCK_SIZE,
  BLOCKS_PER_COLUMN,
  BLOCKS_PER_EPOCH,
  BLOCKS_PER_ROW,
} from './constants';

// Using an actual clipping mask is far less performant than just drawing over the areas we've already plotted.
// So this component just draws a few rectangles over the empty area.
// The rectangles are slightly enlarged to cover gaps between them thick or borders that would hang outside of them.

export const EmptyMask = memo(
  ({
    countEpochs,
    countTotalBlocks,
  }: {
    countEpochs: number;
    countTotalBlocks: number;
  }) => {
    const partiallyEmptyRow = Math.floor(
      (countTotalBlocks + 1 - (countEpochs - 1) * BLOCKS_PER_EPOCH) /
        BLOCKS_PER_ROW
    );

    const partiallyEmptyIndexInRow = (countTotalBlocks + 1) % BLOCKS_PER_ROW;
    const partiallyEmptyWidth = BLOCKS_PER_ROW - partiallyEmptyIndexInRow;

    return (
      <>
        <Rectangle
          x={
            ((countEpochs - 1) * BLOCKS_PER_ROW + partiallyEmptyIndexInRow) *
            BLOCK_SIZE
          }
          y={partiallyEmptyRow * BLOCK_SIZE}
          width={(partiallyEmptyWidth + 1) * BLOCK_SIZE}
          height={BLOCK_SIZE * 2}
          fill={BLACK}
        />
        <Rectangle
          x={(countEpochs - 1) * BLOCKS_PER_ROW * BLOCK_SIZE}
          y={(partiallyEmptyRow + 1) * BLOCK_SIZE}
          width={(BLOCKS_PER_ROW + 1) * BLOCK_SIZE}
          height={(BLOCKS_PER_COLUMN - partiallyEmptyRow + 1) * BLOCK_SIZE}
          fill={BLACK}
        />
      </>
    );
  }
);

EmptyMask.displayName = 'EmptyMask';
