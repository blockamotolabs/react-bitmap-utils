import {
  ORANGE,
  ORANGE_DARK,
  Rectangle,
  While,
} from '@bitmapland/react-bitmap-utils';
import React, { memo } from 'react';

import {
  BLOCK_SIZE,
  BLOCKS_PER_DIFFICULTY_PERIOD,
  BLOCKS_PER_EPOCH,
  BLOCKS_PER_ROW,
} from './constants';

// We use a while loop here as each difficulty period's position will be relative to the last

export const DifficultyPeriods = memo(
  ({ countTotalBlocks }: { countEpochs: number; countTotalBlocks: number }) => (
    <While
      context={{
        index: 0,
        remainingInPeriod: BLOCKS_PER_DIFFICULTY_PERIOD,
      }}
      test={({ index }) => index < countTotalBlocks}
    >
      {(context) => {
        const { index, remainingInPeriod } = context;
        const periodIndex = Math.floor(index / BLOCKS_PER_DIFFICULTY_PERIOD);
        const isEven = !(periodIndex % 2);
        const epochIndex = Math.floor(index / BLOCKS_PER_EPOCH);
        const epochOffset = epochIndex * BLOCKS_PER_ROW * BLOCK_SIZE;
        const row = Math.floor((index % BLOCKS_PER_EPOCH) / BLOCKS_PER_ROW);
        const column = index % BLOCKS_PER_ROW;
        const width = Math.min(BLOCKS_PER_ROW - column, remainingInPeriod);

        const element = (
          <Rectangle
            key={index}
            x={epochOffset + column * BLOCK_SIZE}
            y={row * BLOCK_SIZE}
            width={width * BLOCK_SIZE}
            height={BLOCK_SIZE}
            fill={isEven ? ORANGE : ORANGE_DARK}
          />
        );

        context.index += width;
        context.remainingInPeriod -= width;

        if (!context.remainingInPeriod) {
          context.remainingInPeriod = BLOCKS_PER_DIFFICULTY_PERIOD;
        }

        return element;
      }}
    </While>
  )
);

DifficultyPeriods.displayName = 'DifficultyPeriods';
