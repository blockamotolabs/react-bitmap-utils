import { BLACK, Rectangle } from '@bitmapland/react-bitmap-utils';
import React, { memo } from 'react';

import {
  BLOCK_SIZE,
  BLOCKS_PER_COLUMN,
  BLOCKS_PER_EPOCH,
  BLOCKS_PER_ROW,
} from './constants';

export const EmptyMask = memo(
  ({
    countEpochs,
    countTotalBlocks,
  }: {
    countEpochs: number;
    countTotalBlocks: number;
  }) => {
    const partiallyEmptyRow = Math.floor(
      (countTotalBlocks - (countEpochs - 1) * BLOCKS_PER_EPOCH) / BLOCKS_PER_ROW
    );

    const partiallyEmptyIndexInRow = countTotalBlocks % BLOCKS_PER_ROW;
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
