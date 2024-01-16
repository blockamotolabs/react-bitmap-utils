import {
  Opacity,
  PointerLocation,
  Rectangle,
  WHITE,
} from '@bitmapland/react-bitmap-utils';
import React, { memo, useMemo } from 'react';

import { BLOCK_SIZE } from './constants';
import {
  getEpochSeparatorWidth,
  getHighlightOpacity,
  getIndexFromCoords,
} from './utils';

export const BlockHighlight = memo(
  ({
    pointerRelativeToMap,
    countTotalBlocks,
    scale,
    zoom,
  }: {
    pointerRelativeToMap: PointerLocation | null;
    countTotalBlocks: number;
    scale: number;
    zoom: number;
  }) => {
    const highlightCoords = useMemo(() => {
      if (!pointerRelativeToMap) {
        return null;
      }

      return {
        x: Math.floor(pointerRelativeToMap.x / BLOCK_SIZE),
        y: Math.floor(pointerRelativeToMap.y / BLOCK_SIZE),
      };
    }, [pointerRelativeToMap]);

    const index = useMemo(() => {
      if (!highlightCoords) {
        return -1;
      }

      return getIndexFromCoords(highlightCoords.x, highlightCoords.y);
    }, [highlightCoords]);

    const opacity = getHighlightOpacity(zoom);

    if (!opacity || !highlightCoords || index < 0 || index > countTotalBlocks) {
      return null;
    }

    return (
      <Opacity opacity={opacity}>
        <Rectangle
          x={highlightCoords.x * BLOCK_SIZE}
          y={highlightCoords.y * BLOCK_SIZE}
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
