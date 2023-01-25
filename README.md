[![codecov](https://codecov.io/gh/teunmooij/jest-nest/branch/main/graph/badge.svg?token=RD1WJQ36WN)](https://codecov.io/gh/teunmooij/jest-nest)
[![snyk](https://snyk.io/test/github/teunmooij/jest-nest/badge.svg)](https://snyk.io/test/github/teunmooij/jest-nest)
[![npm version](https://badge.fury.io/js/jest-nest.svg)](https://badge.fury.io/js/jest-nest)

# jest-nest

Jest mocks for curried, chained functions and nested objects

- Create mock for curried function with any number of parameters
- Create mock for chained function of any depth
- Create mock for objects that return (deeply) nested objects and specify return values at any path
- Easy to use expectation

With this you can write:

```typescript
const mock = nest.obj().mockReturnValueAt('foo', 'bar', nest.curry(3));

expect(mock).toHaveBeenNestedCalledWith(nest.args.foo('a', 'b').bar('c')('d', 'e')('f'));
```

Instead of:

```typescript
const deeperNestedFunction = jest.fn();
const nestedFunction = jest.fn().mockReturnValue(deeperNestedFunction);
const nestedObject = { bar: jest.fn().mockReturnValue(nestedFunction) };
const mock = { foo: jest.fn().mockReturnValue(nestedObject) };

expect(mock).toHaveBeenCalledWith('a', 'b');
expect(nestedObject).toHaveBeenCalledWith('c');
expect(nestedFunction).toHaveBeenCalledWith('d', 'e');
expect(deeperNestedFunction).toHaveBeenCalledWith('f');
```

## Installation

```shell
$ npm install jest-nest
```

## Configuration

Create a `setup` file:

```typescript
import { init } from 'jest-nest';

init();
```

And load it in your jest config:

```typescript
import { Config } from 'jest';

const config: Config = {
  ...
  setupFilesAfterEnv: ['./test/setup.ts'],
};

export default config;

```

## Usage

### Curried functions

```typescript
it('expects curried function call', () => {
  const mockImplementation = (a, b, c, d) => 'my return value';
  const curryFn = nest.curry(mockImplementation);

  const result = nestedFn('a', 'b')({ foo: 'bar' })('c');

  // Make any expectation against curryFn.uncurried like you would with any jest.Mock
  expect(curryFn.uncurried).toHaveBeenCalledWith('a', 'b', { foo: expect.any(String) }, 'c');
  // Or make expectations on how the mock was called
  expect(curryFn).toHaveBeenNestedCalledWith(nest.args('a', 'b')({ foo: expect.any(String) })('c'));

  expect(result).toBe('my return value');
});
```

or without an implementation

```typescript
it('expects curried function call', () => {
  const arity = 4;
  const curryFn = nest.curry(arity);

  const result = nestedFn('a', 'b')({ foo: 'bar' })('c');

  expect(curryFn.uncurried).toHaveBeenCalledWith('a', 'b', { foo: expect.any(String) }, 'c');
});
```

or with a curried function as implementation

```typescript
it('expects curried function call', () => {
  import myCurriedFunc from './myFunc';

  // Because the function is curried, the arity cannot be derived automatically
  const curryFn = nest.curry(myCurriedFunc, 4);

  const result = nestedFn('a', 'b')({ foo: 'bar' })('c');

  // Expectations can be made on full chains
  expect(curryFn.uncurried).toHaveBeenCalledWith('a', 'b', { foo: expect.any(String) }, 'c');
  // or make expectations on how the mock was (partially) called
  expect(curryFn).toHaveBeenNestedCalledWith(nest.args('a', 'b'));
});
```

### Chained functions

For nested functions with a fixed depth of nesting and possibly with optional arguments, the nesting mock can be used.

```typescript
it('expects nested function call', () => {
  const nestedFn = nest.fn(
    3, // depth, optional, default: 2
    () => 'my return value', // tail implementation, optional
  );

  const result = nestedFn('a', 'b')({ foo: 'bar' })('c');

  expect(nestedFn).toHaveBeenNestedCalledWith(nest.args('a', 'b')({ foo: expect.any(String) })('c'));
  expect(result).toBe('my return value');
});
```

### (Nested) objects

### Combined mocks

## Api reference

### Mocks

```typescript
interface CallState {
      readonly callPath: ReadonlyArray<ReadonlyArray<any>>;
}

export type NestingMock = jest.Mock & CallState;

export type CurryMock = NestingMock & {
  uncurried: jest.Mock;
};

export type ObjectMock<Shape, Strict extends boolean> = NestingMock & {
  mockImplementationAt: (...path: string[], implementation: (this: CallState, ...args: any[]) => any): ObjectMock<NewShape, Strict>;
  mockReturnValueAt: (...path: string[], value: any) => any): ObjectMock<NewShape, Strict>;
  mockResolvedValueAt: (...path: string[], value: any): ObjectMock<NewShape, Strict>;
  mockRejectedValueAt: (...path: string[], value: any): ObjectMock<NewShape, Strict>;
  mockGetValueAt: (...path: string[], value: any): ObjectMock<NewShape, Strict>;
  mockStrict: (): ObjectMock<Shape, true>;
  mockImplicit: (): ObjectMock<Shape, false>;
} & Shape & Record<string | number | symbol, Strict extends true ? never : jest.Mock<ObjectMock<{}, Strict>>>

export declare function fnCurried(mockImplementation: (...args: any[]) => any, arity?: number): CurryMock;
export declare function fnCurried(arity: number): CurryMock;

export declare function fnNested(depth?: number, tailImplementation?: (...args: any[]) => any): NestingMock;

export declare function objNested(): ObjectMock<{}, false>;
```

### Expectations

```typescript
namespace jest {
  interface Matchers<R> {
    toHaveBeenNestedCalledWith(nestedArgs: any[][] | NestingArgs): R;
  }
}

export type NestingArgs = {
  (...args: any[]): NestingArgs;
  args: any[][];
} & Record<string | number | symbol, (...args: any[]) => NestingArgs>;

export declare const nestingArgs: NestingArgs;
```

### Global exports

```typescript
declare global {
  var nest: {
    fn: typeof fnNested;
    chain: fnNested;
    curry: typeof fnCurried;
    obj: typeof objNested;
    args: typeof nestingArgs;
  };
}
```

## Version history

### v2.2

- Object mocks

### v2.1

- Option to override arity of nest.mock (needed for curried implementations)
- Improved installation experience

### v2.0

- Curried jest mock
- Nesting mock binding to the tail function, to provide access to the callPath

### v1.0:

- Nested jest mock
- Nesting args helper
- `toHaveBeenNestedCalledWith` jest custom matcher
