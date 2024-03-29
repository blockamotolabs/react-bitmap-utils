import { Line, Scale } from '@blockamotolabs/react-bitmap-utils';
import React, { memo } from 'react';

import { Circle } from './custom-renderers';

// This is just for demonstration purposes, so we can see where the center of the screen is

export const Crosshair = memo(({ scale }: { scale: number }) => {
  return (
    <Scale x={1 / scale} y={1 / scale}>
      {/* This is a custom component defined in custom-renderers.tsx */}
      <Circle x={0} y={0} radius={20} stroke="cyan" strokeWidth={1} />
      <Line
        startX={0}
        startY={-10}
        endX={0}
        endY={10}
        strokeWidth={1}
        stroke="cyan"
      />
      <Line
        startX={-10}
        startY={0}
        endX={10}
        endY={0}
        strokeWidth={1}
        stroke="cyan"
      />
    </Scale>
  );
});

Crosshair.displayName = 'Crosshair';
