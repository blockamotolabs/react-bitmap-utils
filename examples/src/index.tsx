import {
  BLACK,
  Canvas,
  clamp,
  ORANGE,
  percentageOf,
  Rectangle,
  remapValue,
  Scale,
  Translate,
  useAutoPixelRatio,
  useEventHandlers,
} from '@bitmapland/react-bitmap-utils';
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

import {
  BLOCK_SIZE,
  BLOCKS_PER_COLUMN,
  BLOCKS_PER_EPOCH,
  BLOCKS_PER_ROW,
  MAX_ZOOM,
  MIN_ZOOM,
} from './constants';
import { EmptyMask } from './empty-mask';
import { EpochLabels } from './epoch-labels';
import { EpochSeparators } from './epoch-separators';
import { Grid } from './grid';

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

  const distantScale = fitWidth
    ? innerWidth / mapWidth
    : innerHeight / mapHeight;
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const scale = remapValue(zoom, MIN_ZOOM, MAX_ZOOM, distantScale, 1);

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
          <Scale x={scale} y={scale}>
            <Translate x={mapWidth * -0.5} y={mapHeight * -0.5}>
              <Rectangle
                x={0}
                y={0}
                width={mapWidth}
                height={mapHeight}
                fill={ORANGE}
              />
              <Grid countEpochs={countEpochs} zoom={zoom} scale={scale} />
              <EpochSeparators countEpochs={countEpochs} scale={scale} />
              <EpochLabels countEpochs={countEpochs} zoom={zoom} />
              <EmptyMask
                countEpochs={countEpochs}
                countTotalBlocks={countTotalBlocks}
              />
            </Translate>
          </Scale>
        </Translate>
      </Canvas>
    </>
  );
};

createRoot(globalThis.document.getElementById('app')!).render(<App />);
