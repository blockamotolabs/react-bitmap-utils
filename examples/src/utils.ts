import {
  BLOCK_SIZE,
  BLOCKS_PER_COLUMN,
  BLOCKS_PER_EPOCH,
  BLOCKS_PER_ROW,
} from './constants';

export const getIndexFromCoords = (x: number, y: number) => {
  const xNoBlockSize = Math.floor(x / BLOCK_SIZE);
  const yNoBlockSize = Math.floor(y / BLOCK_SIZE);
  const epochIndex = Math.floor(xNoBlockSize / BLOCKS_PER_ROW);
  const column = xNoBlockSize % BLOCKS_PER_ROW;
  const row = yNoBlockSize % BLOCKS_PER_COLUMN;

  return epochIndex * BLOCKS_PER_EPOCH + row * BLOCKS_PER_ROW + column;
};

export const getCoordsFromIndex = (index: number) => {
  const epochIndex = Math.floor(index / BLOCKS_PER_EPOCH);
  const row = Math.floor((index % BLOCKS_PER_EPOCH) / BLOCKS_PER_ROW);
  const column = index % BLOCKS_PER_ROW;

  return {
    x: epochIndex * BLOCKS_PER_ROW * BLOCK_SIZE + column * BLOCK_SIZE,
    y: row * BLOCK_SIZE,
  };
};
