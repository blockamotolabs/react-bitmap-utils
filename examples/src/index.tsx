import {
  BLACK,
  Canvas,
  clamp,
  Coordinates,
  getDistance,
  getLocationWithinElement,
  ORANGE,
  percentageOf,
  Rectangle,
  remapValue,
  Scale,
  Translate,
  useEventHandlers,
  useRecommendedPixelRatio,
} from '@bitmapland/react-bitmap-utils';
import React, { useMemo, useRef, useState } from 'react';
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
import { getBlockOpacity, getTargetBlock } from './utils';

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

  // The actual area for drawing the map (when zoomed out)
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const innerAspectRatio = innerWidth / innerHeight;

  // The total size of the map (when zoomed in)
  const mapWidth = countEpochs * BLOCK_SIZE * BLOCKS_PER_ROW;
  const mapHeight = BLOCKS_PER_COLUMN * BLOCK_SIZE;
  const mapAspectRatio = mapWidth / mapHeight;

  const fitWidth = innerAspectRatio < mapAspectRatio;

  // The scale of the map when zoomed out (to best fit inside the aspect ratio)
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

    return {
      x: clamp(location.x - drag.x, 0, mapWidth),
      y: clamp(location.y - drag.y, 0, mapHeight),
    };
  }, [drag, location, mapWidth, mapHeight]);

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

  const mouseDownRef = useRef<Coordinates | null>(null);
  const mouseThresholdBrokenRef = useRef(false);

  useEventHandlers(
    useMemo(
      () => ({
        onWheel: (event) => {
          if (!canvas) {
            return;
          }

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
        onMouseDown: (event) => {
          if (!canvas) {
            return;
          }

          event.preventDefault();

          const loc = getLocationWithinElement(event, canvas);

          mouseDownRef.current = {
            x: loc.x,
            y: loc.y,
          };
        },
        onMouseMove: (event) => {
          if (!canvas) {
            return;
          }

          const loc = getLocationWithinElement(event, canvas);

          setPointer({
            x: loc.x,
            y: loc.y,
          });

          if (mouseDownRef.current) {
            if (getDistance(loc, mouseDownRef.current) > 10) {
              mouseThresholdBrokenRef.current = true;
            }

            setDrag({
              x: (loc.x - mouseDownRef.current.x) / scale,
              y: (loc.y - mouseDownRef.current.y) / scale,
            });
          }
        },
        onMouseUp: () => {
          setDrag(null);
          setLocation((prev) => ({
            x: clamp(prev.x - (drag?.x ?? 0), 0, mapWidth),
            y: clamp(prev.y - (drag?.y ?? 0), 0, mapHeight),
          }));

          const index = getTargetBlock(
            mouseDownRef.current,
            locationWithDrag,
            countTotalBlocks,
            width,
            height,
            scale
          )?.index;

          if (
            !mouseThresholdBrokenRef.current &&
            typeof index === 'number' &&
            getBlockOpacity(zoom)
          ) {
            alert(`You clicked block ${index}`);
          }

          mouseDownRef.current = null;
          mouseThresholdBrokenRef.current = false;
        },
      }),
      [
        canvas,
        scale,
        locationWithDrag,
        width,
        height,
        zoom,
        drag?.x,
        drag?.y,
        mapWidth,
        mapHeight,
      ]
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
