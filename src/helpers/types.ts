export type Key = string | number | symbol;
export type Path = ReadonlyArray<Key>;
export type MockRegistration<P extends Path = Path, V = any> = { path: P; value: V };

type AsKey<T> = T extends Key ? T : never;
type AsPath<T> = T extends Path ? T : never;
type Root<P extends Path> = AsKey<P extends Readonly<[infer R, ...any[]]> ? R : never>;
type Rest<P extends Path> = AsPath<P extends Readonly<[any, ...infer R]> ? R : never>;

export type WithPath<Shape, P extends Path, V> = Shape & {
  [x in Root<P>]: Rest<P> extends []
    ? V
    : x extends keyof Shape
    ? Shape[x] extends (...args: any[]) => any
      ? (
          ...args: Parameters<Shape[x]>
        ) => ReturnType<Shape[x]> extends PromiseLike<infer R>
          ? Promise<WithPath<P, Rest<R>, V>>
          : WithPath<ReturnType<Shape[x]>, Rest<P>, V>
      : WithPath<Shape[x], Rest<P>, V>
    : never;
};

export interface CallState {
  callPath: any[][];
}
