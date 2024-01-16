import {
  BLOCKS_PER_COLUMN,
  BLOCKS_PER_EPOCH,
  BLOCKS_PER_ROW,
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
