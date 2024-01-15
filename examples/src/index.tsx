import {
  BLACK,
  Canvas,
  clamp,
  ORANGE,
  percentageOf,
  PointerLocation,
  Rectangle,
  remapValue,
  Scale,
  Text,
  Translate,
  useAverageFrameRate,
  useEventHandlers,
  usePointerStateWithinElement,
  useRecommendedPixelRatio,
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
import { DifficultyPeriods } from './difficulty-periods';
import { EmptyMask } from './empty-mask';
import { EpochLabels } from './epoch-labels';
import { EpochSeparators } from './epoch-separators';
import { Grid } from './grid';

const App = () => {
  const averageFrameRate = useAverageFrameRate(60);
  const countTotalBlocks = 812345;
  const countEpochs = Math.ceil(countTotalBlocks / BLOCKS_PER_EPOCH);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const pixelRatio = useRecommendedPixelRatio();
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
  const [location, setLocation] = useState({
    x: mapWidth * 0.5,
    y: mapHeight * 0.5,
  });
  const scale = remapValue(zoom, MIN_ZOOM, MAX_ZOOM, distantScale, 1);

  useEventHandlers(
    useMemo(
      () => ({
        onWheel: (event) => {
          event.preventDefault();
          const { deltaY } = event;

          setZoom((prevZoom) =>
            clamp(
              prevZoom -
                deltaY *
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

  const [drag, setDrag] = useState<PointerLocation | null>(null);

  usePointerStateWithinElement(
    useMemo(
      () => ({
        onPointerMove: (pointers) => {
          if (pointers.dragged) {
            setDrag(pointers.dragged);
          }
        },
        onPointerUp: (_pointers, prevPointers) => {
          setDrag(null);
          setLocation((prev) => {
            if (!prevPointers.dragged) {
              return prev;
            }

            return {
              x: clamp(prev.x - prevPointers.dragged.x / scale, 0, mapWidth),
              y: clamp(prev.y - prevPointers.dragged.y / scale, 0, mapHeight),
            };
          });
        },
      }),
      [scale, mapWidth, mapHeight]
    ),
    canvas
  );

  const locationWithDrag = useMemo(() => {
    if (!drag) {
      return location;
    }

    const { x, y } = drag;

    return {
      x: clamp(location.x - x / scale, 0, mapWidth),
      y: clamp(location.y - y / scale, 0, mapHeight),
    };
  }, [drag, scale, location, mapWidth, mapHeight]);

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
            <Translate x={-locationWithDrag.x} y={-locationWithDrag.y}>
              <Rectangle
                x={0}
                y={0}
                width={mapWidth}
                height={mapHeight}
                fill={ORANGE}
              />
              <DifficultyPeriods
                countEpochs={countEpochs}
                countTotalBlocks={countTotalBlocks}
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
        <Text x={4} y={4} fontSize={12} fill="white">
          {averageFrameRate.toFixed(0)} FPS
        </Text>
      </Canvas>
    </>
  );
};

createRoot(globalThis.document.getElementById('app')!).render(<App />);
