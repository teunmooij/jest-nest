/* eslint-disable @typescript-eslint/ban-types */
import { NestingMock } from './nestingMock';

export type Key = string | number | symbol;
export type Path = ReadonlyArray<Key>;
export type MockRegistration<P extends Path = Path, V = any> = { path: P; value: V };

type AsKey<T> = T extends Key ? T : never;
type AsPath<T> = T extends Path ? T : never;
type Root<P extends Path> = AsKey<P extends Readonly<[infer R, ...any[]]> ? R : never>;
type Rest<P extends Path> = AsPath<P extends Readonly<[any, ...infer R]> ? R : never>;

type NoFunc<T> = Pick<T, Exclude<keyof T, keyof Function>>;

export type WithPath<Shape, Strict extends boolean, P extends Path, V> = Shape & {
  [K in Root<P>]: Rest<P> extends []
    ? V
    : K extends keyof Shape
    ? Shape[K] extends jest.Mock<ObjectMock<infer KShape, any>>
      ? jest.Mock<ObjectMock<WithPath<KShape, Strict, Rest<P>, V>, Strict>>
      : Shape[K] extends (...args: any[]) => any
      ? (
          ...args: Parameters<Shape[K]>
        ) => ReturnType<Shape[K]> extends PromiseLike<infer PR>
          ? Promise<WithPath<PR, Strict, Rest<P>, V>>
          : WithPath<ReturnType<Shape[K]>, Strict, Rest<P>, V>
      : WithPath<Shape[K], Strict, Rest<P>, V>
    : jest.Mock<ObjectMock<WithPath<{}, Strict, Rest<P>, V>, Strict>>;
};

type UnknownProp<Strict extends boolean> = Strict extends true ? never : jest.Mock<ObjectMock<{}, Strict>>;

type SetStrictMode<Shape, Strict extends boolean> = {
  [K in keyof Shape]: Shape[K] extends jest.Mock<ObjectMock<infer KShape, any>>
    ? jest.Mock<ObjectMock<SetStrictMode<KShape, Strict>, Strict>>
    : Shape[K];
};

export type ObjectMock<Shape, Strict extends boolean> = NoFunc<NestingMock> & {
  mockImplementationAt<Props extends Path, Implementation extends (this: CallState, ...args: any[]) => any>(
    ...args: [...Props, Implementation]
  ): ObjectMock<WithPath<Shape, Strict, Props, Implementation>, Strict>;
  mockReturnValueAt<Props extends Path, Value extends {}, I extends (...args: any[]) => Value = (...args: any[]) => Value>(
    ...args: [...Props, Value]
  ): ObjectMock<WithPath<Shape, Strict, Props, I>, Strict>;
  mockResolvedValueAt<
    Props extends Path,
    Value extends {},
    I extends (...args: any[]) => Promise<Value> = (...args: any[]) => Promise<Value>,
  >(
    ...args: [...Props, Value]
  ): ObjectMock<WithPath<Shape, Strict, Props, I>, Strict>;
  mockRejectedValueAt<
    Props extends Path,
    Value extends {},
    I extends (...args: any[]) => Promise<Value> = (...args: any[]) => Promise<Value>,
  >(
    ...args: [...Props, Value]
  ): ObjectMock<WithPath<Shape, Strict, Props, I>, Strict>;
  mockGetValueAt<Props extends Path, Value>(
    ...args: [...Props, Value]
  ): ObjectMock<WithPath<Shape, Strict, Props, Value>, Strict>;
  mockStrict(): ObjectMock<SetStrictMode<Shape, true>, true>;
  mockImplicit(): ObjectMock<SetStrictMode<Shape, false>, false>;
} & Shape &
  Record<Key, UnknownProp<Strict>>;

export interface CallState {
  readonly callPath: ReadonlyArray<ReadonlyArray<any>>;
}

export interface ObjectMockState extends CallState {
  context: jest.Mock;
  registrations: MockRegistration[];
  self: ObjectMock<any, boolean>;
  strict: boolean;
}
