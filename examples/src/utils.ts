import { remapValue } from '../../src/utils';
import {
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
