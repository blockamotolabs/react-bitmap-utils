// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: readonly any[]) => any;

export type UnionToIntersection<U> = (
  U extends AnyObject ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Merge<T> = Pick<T, keyof T>;

export type RemapKeys<
  T extends AnyObject,
  M extends Partial<Record<keyof T, string>>,
> = Merge<
  UnionToIntersection<
    {
      [K in keyof M | keyof T]: K extends keyof T
        ? M[K] extends string
          ? M[K] extends keyof T
            ? never
            : Partial<T>[K] extends T[K]
              ? {
                  [V in M[K]]?: T[K];
                }
              : {
                  [V in M[K]]: T[K];
                }
          : Partial<T>[K] extends T[K]
            ? {
                [P in K]?: T[K];
              }
            : {
                [P in K]: T[K];
              }
        : never;
    }[keyof M | keyof T]
  >
>;
