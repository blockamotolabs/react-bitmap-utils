import { Opacity, Rectangle, WHITE } from '@blockamotolabs/react-bitmap-utils';
import React, { memo } from 'react';

import { BLOCK_SIZE } from './constants';
import {
  getEpochSeparatorWidth,
  getHighlightOpacity,
  TargetBlock,
} from './utils';

export const BlockHighlight = memo(
  ({
    highlightedBlock,
    scale,
    zoom,
  }: {
    highlightedBlock: TargetBlock | null;
    scale: number;
    zoom: number;
  }) => {
    const opacity = getHighlightOpacity(zoom);

    if (!opacity || !highlightedBlock) {
      return null;
    }

    return (
      <Opacity opacity={opacity}>
        <Rectangle
          x={highlightedBlock.x * BLOCK_SIZE}
          y={highlightedBlock.y * BLOCK_SIZE}
          width={BLOCK_SIZE}
          height={BLOCK_SIZE}
          stroke={WHITE}
          strokeWidth={getEpochSeparatorWidth(scale) * 0.5}
        />
      </Opacity>
    );
  }
);

BlockHighlight.displayName = 'BlockHighlight';
