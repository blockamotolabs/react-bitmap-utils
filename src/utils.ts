import { AnyObject } from './internal/types';
import { HandlerNameToEventName } from './types';

export const hasKey = <T extends AnyObject, K extends string>(
  obj: T,
  key: K
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): obj is T extends Record<K, any> ? T : never => key in obj;

export const isKeyOf = <T extends AnyObject, K extends string>(
  obj: T,
  key: K
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): key is K extends keyof T ? K : never => key in obj;

export const isArray = <T>(
  input: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): input is T extends readonly any[] ? T : never => Array.isArray(input);

export const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

export const radiansToDegrees = (radians: number) => radians * (180 / Math.PI);

export const percentageOf = (percentage: number, total: number) =>
  (percentage / 100) * total;

export const roundSquareRoot = (total: number) => {
  let idealX = 0;
  let idealY = 0;
  let smallestDiff = Infinity;

  for (let x = 1; x < total; x += 1) {
    const y = total / x;
    const diff = Math.abs(x - y);

    if (!(y % 1) && diff < smallestDiff) {
      smallestDiff = diff;
      idealX = x;
      idealY = y;
    }
  }

  return idealX > idealY ? idealX : idealY;
};

export const clamp = (value: number, min: number, max: number) => {
  if (min > max) {
    return Math.min(Math.max(value, max), min);
  }

  return Math.min(Math.max(value, min), max);
};

export const remapValue = (
  value: number,
  fromStart: number,
  fromEnd: number,
  toStart: number,
  toEnd: number,
  shouldClamp?: boolean
) => {
  const fromRange = fromEnd - fromStart;
  const toRange = toEnd - toStart;
  const scale = toRange / fromRange;
  const dist = value - fromStart;

  const result = toStart + dist * scale;

  if (shouldClamp) {
    return clamp(result, toStart, toEnd);
  }

  return result;
};

const MATCHES_ON_PREFIX = /^on/;

export const handlerNameToEventName = <const T extends string>(
  handlerName: T
) =>
  handlerName
    .replace(MATCHES_ON_PREFIX, '')
    .toLowerCase() as HandlerNameToEventName<T>;

export const getDimensions = (
  pixelRatio: number,
  width: number | undefined,
  height: number | undefined,
  canvas: HTMLCanvasElement | null | undefined
) => {
  return {
    width:
      typeof width === 'number'
        ? width * pixelRatio
        : (canvas?.clientWidth ?? 0) * pixelRatio,
    height:
      typeof height === 'number'
        ? height * pixelRatio
        : (canvas?.clientHeight ?? 0) * pixelRatio,
  };
};

export const getLocationWithinElement = (
  client: { clientX: number; clientY: number },
  element: HTMLElement
) => {
  const rect = element.getBoundingClientRect();

  return {
    x: client.clientX - rect.left,
    y: client.clientY - rect.top,
  };
};

export const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const a = x1 - x2;
  const b = y1 - y2;

  return Math.sqrt(a * a + b * b);
};

export const getDifference = (a: number, b: number) => a - b;
