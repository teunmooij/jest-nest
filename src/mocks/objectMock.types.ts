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
  /**
   * Sets a mock implementation at a given path
   * @param {...Path} props property path
   * @param {(this: CallState, ...args: any[]) => any} implementation mock implementation at the given path
   * @example mock.mockImplementationAt('foo', 'bar', () => 42);
   * @example mock.mockImplementationAt('foo', 'bar', function(this CallState) {
   *   // inspect the call path
   *   const [fooArgs, barArgs] = this.callPath
   * });
   */
  mockImplementationAt<Props extends Path, Implementation extends (this: CallState, ...args: any[]) => any>(
    ...args: [...Props, Implementation]
  ): ObjectMock<WithPath<Shape, Strict, Props, Implementation>, Strict>;
  /**
   * Sets a return value at a given path
   * @param {...Path} props property path
   * @param {any} value return value at the given path
   * @example mock.mockReturnValueAt('foo', 'bar', 42)
   */
  mockReturnValueAt<Props extends Path, Value extends {}, I extends (...args: any[]) => Value = (...args: any[]) => Value>(
    ...args: [...Props, Value]
  ): ObjectMock<WithPath<Shape, Strict, Props, I>, Strict>;
  /**
   * Sets a resolved promise value at a given path
   * @param {...Path} props property path
   * @param {any} value resolved promise value at the given path
   * @example mock.mockResolvedValueAt('foo', 'bar', 42)
   */
  mockResolvedValueAt<
    Props extends Path,
    Value extends {},
    I extends (...args: any[]) => Promise<Value> = (...args: any[]) => Promise<Value>,
  >(
    ...args: [...Props, Value]
  ): ObjectMock<WithPath<Shape, Strict, Props, I>, Strict>;
  /**
   * Sets a rejected promise value at a given path
   * @param {...Path} props property path
   * @param {any} value rejected promise value at the given path
   * @example mock.mockRejectedValueAt('foo', 'bar', 42)
   */
  mockRejectedValueAt<
    Props extends Path,
    Value extends {},
    I extends (...args: any[]) => Promise<Value> = (...args: any[]) => Promise<Value>,
  >(
    ...args: [...Props, Value]
  ): ObjectMock<WithPath<Shape, Strict, Props, I>, Strict>;
  /**
   * Sets a property value at a given path
   * @param {...Path} props property path
   * @param {any} value property value at the given path
   * @example mock.mockReturnValueAt('foo', 'bar', 42)
   */
  mockGetValueAt<Props extends Path, Value>(
    ...args: [...Props, Value]
  ): ObjectMock<WithPath<Shape, Strict, Props, Value>, Strict>;
  /**
   * Sets the mode of the object mock to strict. In strict mode, any properties that have not been explicitely set return a value of 'undefined'
   */
  mockStrict(): ObjectMock<SetStrictMode<Shape, true>, true>;
  /**
   * Sets the mode of the object mock to implicit. In implicit mode, any properties that have not been explicitely set return a function that returns an 'ObjectMock'
   */
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
