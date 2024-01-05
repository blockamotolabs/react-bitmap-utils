import { AnyObject, HandlerNameToEventName } from './types';

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

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const remapValue = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
  shouldClamp?: boolean
) => {
  const fromRange = fromMax - fromMin;
  const toRange = toMax - toMin;
  const scale = toRange / fromRange;
  const dist = value - fromMin;

  const result = toMin + dist * scale;

  if (shouldClamp) {
    return clamp(result, toMin, toMax);
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
