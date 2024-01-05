import {
  BLACK,
  Canvas,
  CanvasBuffer,
  clamp,
  ForEach,
  Line,
  Opacity,
  ORANGE,
  percentageOf,
  Rectangle,
  remapValue,
  roundSquareRoot,
  Scale,
  Text,
  Translate,
  useAutoPixelRatio,
  useEventHandlers,
  WHITE,
} from '@bitmapland/react-bitmap-utils';
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

const BLOCK_SIZE = 100;
const BLOCKS_PER_EPOCH = 210000;
// const BLOCKS_PER_DIFFICULTY_PERIOD = 2016;
const BLOCKS_PER_ROW = roundSquareRoot(BLOCKS_PER_EPOCH);
const BLOCKS_PER_COLUMN = BLOCKS_PER_EPOCH / BLOCKS_PER_ROW;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2;

const App = () => {
  const countTotalBlocks = 812345;
  const countEpochs = Math.ceil(countTotalBlocks / BLOCKS_PER_EPOCH);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
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
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const mappedScale = remapValue(zoom, MIN_ZOOM, MAX_ZOOM, scale, 1);

  useEventHandlers(
    useMemo(
      () => ({
        onWheel: (event) => {
          event.preventDefault();
          const { deltaY } = event;

          setZoom((prevZoom) =>
            clamp(
              prevZoom +
                -deltaY *
                  remapValue(prevZoom, MIN_ZOOM, MAX_ZOOM, 0.00001, 0.002),
              MIN_ZOOM,
              MAX_ZOOM
            )
          );
        },
      }),
      []
    ),
    canvas
  );

  const partiallyEmptyRow = Math.floor(
    (countTotalBlocks - (countEpochs - 1) * BLOCKS_PER_EPOCH) / BLOCKS_PER_ROW
  );

  const partiallyEmptyIndexInRow = countTotalBlocks % BLOCKS_PER_ROW;
  const partiallyEmptyWidth = BLOCKS_PER_ROW - partiallyEmptyIndexInRow;

  return (
    <>
      <Canvas
        ref={setCanvas}
        pixelRatio={pixelRatio}
        backgroundColor={BLACK}
        style={{ width: '100%', height: '100%' }}
        onResize={setDimensions}
      >
        <Translate x={width * 0.5} y={height * 0.5}>
          <Scale x={mappedScale} y={mappedScale}>
            <Translate x={mapWidth * -0.5} y={mapHeight * -0.5}>
              <Rectangle
                x={0}
                y={0}
                width={mapWidth}
                height={mapHeight}
                fill={ORANGE}
              />
              <Opacity
                opacity={remapValue(zoom, MIN_ZOOM, MAX_ZOOM - 0.5, 0, 1)}
              >
                <ForEach end={countEpochs * BLOCKS_PER_ROW}>
                  {({ index }) => (
                    <Line
                      key={index}
                      startX={index * BLOCK_SIZE}
                      startY={0}
                      endX={index * BLOCK_SIZE}
                      endY={BLOCKS_PER_COLUMN * BLOCK_SIZE}
                      stroke={BLACK}
                      strokeWidth={1 / mappedScale}
                    />
                  )}
                </ForEach>
                <ForEach end={BLOCKS_PER_COLUMN}>
                  {({ index }) => (
                    <Line
                      key={index}
                      startX={0}
                      startY={index * BLOCK_SIZE}
                      endX={countEpochs * BLOCKS_PER_ROW * BLOCK_SIZE}
                      endY={index * BLOCK_SIZE}
                      stroke={BLACK}
                      strokeWidth={1 / mappedScale}
                    />
                  )}
                </ForEach>
              </Opacity>
              <ForEach start={1} end={countEpochs}>
                {({ index }) => (
                  <Line
                    key={index}
                    startX={index * BLOCKS_PER_ROW * BLOCK_SIZE}
                    startY={0}
                    endX={index * BLOCKS_PER_ROW * BLOCK_SIZE}
                    endY={BLOCKS_PER_COLUMN * BLOCK_SIZE}
                    stroke={BLACK}
                    strokeWidth={2 / mappedScale + Math.cos(mappedScale) * 4}
                  />
                )}
              </ForEach>
              <Rectangle
                x={
                  ((countEpochs - 1) * BLOCKS_PER_ROW +
                    partiallyEmptyIndexInRow) *
                  BLOCK_SIZE
                }
                y={partiallyEmptyRow * BLOCK_SIZE}
                width={(partiallyEmptyWidth + 1) * BLOCK_SIZE}
                height={BLOCK_SIZE}
                fill={BLACK}
              />
              <Rectangle
                x={(countEpochs - 1) * BLOCKS_PER_ROW * BLOCK_SIZE}
                y={(partiallyEmptyRow + 1) * BLOCK_SIZE}
                width={(BLOCKS_PER_ROW + 1) * BLOCK_SIZE}
                height={(BLOCKS_PER_COLUMN - partiallyEmptyRow) * BLOCK_SIZE}
                fill={BLACK}
              />
              <Opacity opacity={remapValue(zoom, MIN_ZOOM, 1.01, 1, 0, true)}>
                <ForEach end={countEpochs}>
                  {({ index }) => (
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
            </Translate>
          </Scale>
        </Translate>
      </Canvas>
    </>
  );
};

createRoot(globalThis.document.getElementById('app')!).render(<App />);
