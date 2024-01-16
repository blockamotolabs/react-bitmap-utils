import { Coordinates, remapValue } from '@bitmapland/react-bitmap-utils';

import {
  BLOCK_SIZE,
  BLOCKS_PER_COLUMN,
  BLOCKS_PER_EPOCH,
  BLOCKS_PER_ROW,
  MAX_ZOOM,
  MIN_ZOOM,
} from './constants';

export const getIndexFromCoords = (x: number, y: number) => {
  const epochIndex = Math.floor(x / BLOCKS_PER_ROW);
  const column = x % BLOCKS_PER_ROW;
  const row = y % BLOCKS_PER_COLUMN;

  return epochIndex * BLOCKS_PER_EPOCH + row * BLOCKS_PER_ROW + column;
};

export const getCoordsFromIndex = (index: number) => {
  const epochIndex = Math.floor(index / BLOCKS_PER_EPOCH);
  const row = Math.floor((index % BLOCKS_PER_EPOCH) / BLOCKS_PER_ROW);
  const column = index % BLOCKS_PER_ROW;

  return {
    x: epochIndex * BLOCKS_PER_ROW + column,
    y: row,
  };
};

export const getEpochSeparatorWidth = (scale: number) =>
  2 / scale + Math.cos(scale) * 4;

export const getBlockOpacity = (zoom: number) =>
  remapValue(zoom, MIN_ZOOM + 0.3, MAX_ZOOM - 0.5, 0, 1, true);

export const getHighlightOpacity = (zoom: number) =>
  remapValue(zoom, MIN_ZOOM + 0.3, MAX_ZOOM - 0.65, 0, 1, true);

export interface TargetBlock extends Coordinates {
  index: number;
}

export const getTargetBlock = (
  pointer: Coordinates | null,
  location: Coordinates,
  width: number,
  height: number,
  scale: number
): TargetBlock | null => {
  if (!pointer) {
    return null;
  }

  const pointerRelativeToMap = {
    x: (pointer.x - width * 0.5 + location.x * scale) / scale,
    y: (pointer.y - height * 0.5 + location.y * scale) / scale,
  };

  const coordinates = {
    x: Math.floor(pointerRelativeToMap.x / BLOCK_SIZE),
    y: Math.floor(pointerRelativeToMap.y / BLOCK_SIZE),
  };

  const index = getIndexFromCoords(coordinates.x, coordinates.y);

  return {
    ...coordinates,
    index,
  };
};
