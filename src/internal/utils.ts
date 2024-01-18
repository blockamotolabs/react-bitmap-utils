import { AnyObject, HandlerNameToEventName } from '../internal/types';

const MATCHES_ON_PREFIX = /^on/;

export const handlerNameToEventName = <const T extends string>(
  handlerName: T
) =>
  handlerName
    .replace(MATCHES_ON_PREFIX, '')
    .toLowerCase() as HandlerNameToEventName<T>;

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
