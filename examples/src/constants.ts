import { roundSquareRoot } from '../../src/utils';

export const BLOCK_SIZE = 100;
export const BLOCKS_PER_EPOCH = 210000;
export const BLOCKS_PER_DIFFICULTY_PERIOD = 2016;
export const BLOCKS_PER_ROW = roundSquareRoot(BLOCKS_PER_EPOCH);
export const BLOCKS_PER_COLUMN = BLOCKS_PER_EPOCH / BLOCKS_PER_ROW;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 2;
