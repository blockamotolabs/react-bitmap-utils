import {
  BLACK,
  Canvas,
  ForEach,
  Line,
  ORANGE,
  percentageOf,
  Rectangle,
  roundSquareRoot,
  Scale,
  Translate,
  useAutoPixelRatio,
} from '@bitmapland/react-bitmap-utils';
import React, { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';

const BLOCK_SIZE = 100;
const BLOCKS_PER_EPOCH = 210000;
// const BLOCKS_PER_DIFFICULTY_PERIOD = 2016;
const BLOCKS_PER_ROW = roundSquareRoot(BLOCKS_PER_EPOCH);
const BLOCKS_PER_COLUMN = BLOCKS_PER_EPOCH / BLOCKS_PER_ROW;

const App = () => {
  const countTotalBlocks = 812345;
  const countEpochs = Math.floor(countTotalBlocks / BLOCKS_PER_EPOCH);

  const pixelRatio = useAutoPixelRatio();
  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 });

  const padding = Math.min(percentageOf(5, width), percentageOf(5, height));

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const innerAspectRatio = innerWidth / innerHeight;

  const mapWidth = countEpochs * BLOCK_SIZE * BLOCKS_PER_ROW;
  const mapHeight = BLOCKS_PER_COLUMN * BLOCK_SIZE;
  const mapAspectRatio = mapWidth / mapHeight;

  const fitWidth = innerAspectRatio < mapAspectRatio;

  const scale = fitWidth ? innerWidth / mapWidth : innerHeight / mapHeight;

  const forEachVerticalLine = useCallback(
    (index: number) => (
      <Line
        startX={index * BLOCK_SIZE}
        startY={0}
        endX={index * BLOCK_SIZE}
        endY={BLOCKS_PER_COLUMN * BLOCK_SIZE}
        stroke={BLACK}
      />
    ),
    []
  );

  const forEachHorizontalLine = useCallback(
    (index: number) => (
      <Line
        startX={0}
        startY={index * BLOCK_SIZE}
        endX={countEpochs * BLOCKS_PER_ROW * BLOCK_SIZE}
        endY={index * BLOCK_SIZE}
        stroke={BLACK}
      />
    ),
    [countEpochs]
  );

  return (
    <>
      <Canvas
        pixelRatio={pixelRatio}
        backgroundColor={BLACK}
        style={{ width: '100%', height: '100%' }}
        onResize={setDimensions}
      >
        <Translate x={width * 0.5} y={height * 0.5}>
          <Scale x={scale} y={scale}>
            <Translate x={mapWidth * -0.5} y={mapHeight * -0.5}>
              <Rectangle
                x={0}
                y={0}
                width={mapWidth}
                height={mapHeight}
                fill={ORANGE}
              />
              <ForEach end={countEpochs * BLOCKS_PER_ROW}>
                {forEachVerticalLine}
              </ForEach>
              <ForEach end={BLOCKS_PER_COLUMN}>{forEachHorizontalLine}</ForEach>
            </Translate>
          </Scale>
        </Translate>
      </Canvas>
    </>
  );
};

createRoot(globalThis.document.getElementById('app')!).render(<App />);
