import { roundSquareRoot } from '@bitmapland/react-bitmap-utils';

// The width/height of each block in pixels
export const BLOCK_SIZE = 100;
export const BLOCKS_PER_EPOCH = 210000;
export const BLOCKS_PER_DIFFICULTY_PERIOD = 2016;
// We calculate the squarest number of blocks to render in a row, so that each epoch is close to a square
export const BLOCKS_PER_ROW = roundSquareRoot(BLOCKS_PER_EPOCH);
export const BLOCKS_PER_COLUMN = BLOCKS_PER_EPOCH / BLOCKS_PER_ROW;
// These numbers are just for reference so that we have a fixed max/min zoom
// They are later remapped to relevant value e.g. opacity from 0 to 1
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 2;
// The width/height of the selection of block numbers we'll actually render around the center of the screen
// 50 x 50 means we'll only ever be rendering 2500 blocks at a time
export const BLOCK_WINDOW_SIZE = 50;
// If we're even closer, let's render less block numbers again
export const BLOCK_WINDOW_SIZE_ZOOMED = 30;
