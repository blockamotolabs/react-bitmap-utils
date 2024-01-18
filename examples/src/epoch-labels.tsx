import {
  CanvasBuffer,
  ForEach,
  Opacity,
  remapValue,
  Text,
  WHITE,
} from '@blockamotolabs/react-bitmap-utils';
import React, { memo } from 'react';

import {
  BLOCK_SIZE,
  BLOCKS_PER_COLUMN,
  BLOCKS_PER_ROW,
  MIN_ZOOM,
} from './constants';

export const EpochLabels = memo(
  ({ countEpochs, zoom }: { countEpochs: number; zoom: number }) => {
    return (
      <Opacity opacity={remapValue(zoom, MIN_ZOOM, 1.01, 1, 0, true)}>
        <ForEach end={countEpochs}>
          {({ index }) => (
            // We draw our epoch labels to an off-screen canvas that is then rendered to the main canvas.
            // This is because some browsers do not handle very large text well.
            // Instead we draw the text at a reasonable size, and scale it like an image.
            <CanvasBuffer
              key={index}
              width={1000}
              height={1000}
              drawX={index * BLOCKS_PER_ROW * BLOCK_SIZE}
              drawY={
                BLOCKS_PER_COLUMN * BLOCK_SIZE * 0.5 -
                BLOCKS_PER_ROW * BLOCK_SIZE * 0.5
              }
              drawWidth={BLOCKS_PER_ROW * BLOCK_SIZE}
              drawHeight={BLOCKS_PER_ROW * BLOCK_SIZE}
            >
              <Text
                x={500}
                y={500}
                fontSize={300}
                textAlign="center"
                verticalAlign="middle"
                fill={WHITE}
              >
                {index + 1}
              </Text>
            </CanvasBuffer>
          )}
        </ForEach>
      </Opacity>
    );
  }
);

EpochLabels.displayName = 'EpochLabels';
