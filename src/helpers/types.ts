export type Key = string | number | symbol;
export type Path = ReadonlyArray<Key>;
export type MockRegistration<P extends Path = Path, V = any> = { path: P; value: V };

type AsKey<T> = T extends Key ? T : never;
type AsPath<T> = T extends Path ? T : never;
type Root<P extends Path> = AsKey<P extends Readonly<[infer R, ...any[]]> ? R : never>;
type Rest<P extends Path> = AsPath<P extends Readonly<[any, ...infer R]> ? R : never>;

type BuildPath<P extends Path, V> = {
  [x in Root<P>]: Rest<P> extends [] ? V : BuildPath<Rest<P>, V>;
};

export type WithPath<Shape extends Record<string, unknown>, P extends Path, V> = Shape & BuildPath<P, V>;

export interface CallState {
  callPath: any[][];
}
