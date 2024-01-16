import {
  BLACK,
  Canvas,
  clamp,
  Coordinates,
  ORANGE,
  percentageOf,
  Rectangle,
  remapValue,
  Scale,
  Translate,
  useEventHandlers,
  usePointerStateWithinElement,
  useRecommendedPixelRatio,
} from '@bitmapland/react-bitmap-utils';
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { BlockHighlight } from './block-highlight';
import { BlockNumbers } from './block-numbers';
import {
  BLOCK_SIZE,
  BLOCKS_PER_COLUMN,
  BLOCKS_PER_EPOCH,
  BLOCKS_PER_ROW,
  MAX_ZOOM,
  MIN_ZOOM,
} from './constants';
import { Crosshair } from './crosshair';
import { DifficultyPeriods } from './difficulty-periods';
import { EmptyMask } from './empty-mask';
import { EpochLabels } from './epoch-labels';
import { EpochSeparators } from './epoch-separators';
import { Grid } from './grid';
import { getHighlightOpacity, getTargetBlock } from './utils';

const App = () => {
  // The average frame rate hook causes the map to re-render every frame
  // This is only used when we're testing performance of the map on various devices
  // const averageFrameRate = useAverageFrameRate();
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

  const [drag, setDrag] = useState<Coordinates | null>(null);
  const [pointer, setPointer] = useState<Coordinates | null>(null);

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

  const highlightedBlock = useMemo(
    () =>
      getTargetBlock(
        pointer,
        locationWithDrag,
        countTotalBlocks,
        width,
        height,
        scale
      ),
    [height, locationWithDrag, pointer, scale, width]
  );

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

  usePointerStateWithinElement(
    useMemo(
      () => ({
        onPointerMove: (pointers) => {
          if (pointers.isTouch === false && pointers.now) {
            setPointer(pointers.now);
          }

          if (pointers.dragged && !pointers.dragged2) {
            setDrag(pointers.dragged);
          }
        },
        onPointerUp: (pointers, prevPointers) => {
          if (prevPointers.isTap) {
            const index = getTargetBlock(
              prevPointers.now,
              locationWithDrag,
              countTotalBlocks,
              width,
              height,
              scale
            )?.index;

            const highlightOpacity = getHighlightOpacity(zoom);

            if (highlightOpacity && typeof index === 'number') {
              alert(`You tapped block ${index}`);
            }
          }

          setDrag(null);
          setLocation((prev) => {
            if (!prevPointers.dragged || pointers.dragged2) {
              return prev;
            }

            return {
              x: clamp(prev.x - prevPointers.dragged.x / scale, 0, mapWidth),
              y: clamp(prev.y - prevPointers.dragged.y / scale, 0, mapHeight),
            };
          });
        },
      }),
      [locationWithDrag, width, height, scale, zoom, mapWidth, mapHeight]
    ),
    canvas
  );

  return (
    <>
      <Canvas
        ref={setCanvas}
        pixelRatio={pixelRatio}
        backgroundColor={BLACK}
        style={{ width: '100%', height: '100%', cursor: 'move' }}
        onResize={setDimensions}
      >
        <Translate x={width * 0.5} y={height * 0.5}>
          <Scale x={scale} y={scale}>
            <Translate x={-locationWithDrag.x} y={-locationWithDrag.y}>
              {/* This just helps us to visualize the area of the map while constructing the visuals */}
              <Rectangle
                x={0}
                y={0}
                width={mapWidth}
                height={mapHeight}
                fill={ORANGE}
              />
              {/* This adds the orange striping for the difficulty adjustment periods */}
              <DifficultyPeriods
                countEpochs={countEpochs}
                countTotalBlocks={countTotalBlocks}
              />
              {/* Instead of drawing as many rectangles as there are blocks, it's far more performant to draw vertical and horizontal lines */}
              <Grid countEpochs={countEpochs} zoom={zoom} scale={scale} />
              <EpochSeparators countEpochs={countEpochs} scale={scale} />
              {/* If you look inside the BlockNumbers component you'll see we only ever draw a limited set of blocks */}
              <BlockNumbers
                countTotalBlocks={countTotalBlocks}
                zoom={zoom}
                location={locationWithDrag}
              />
              <EpochLabels countEpochs={countEpochs} zoom={zoom} />
              {/* This is used to mask the end of the chain where an epoch is not complete */}
              <EmptyMask
                countEpochs={countEpochs}
                countTotalBlocks={countTotalBlocks}
              />
              <BlockHighlight
                highlightedBlock={highlightedBlock}
                scale={scale}
                zoom={zoom}
              />
            </Translate>
            <Crosshair scale={scale} />
          </Scale>
        </Translate>
        {/* <Text x={4} y={4} fontSize={12} fill="white">
          {averageFrameRate.toFixed(0)} FPS
        </Text> */}
      </Canvas>
    </>
  );
};

createRoot(globalThis.document.getElementById('app')!).render(<App />);
