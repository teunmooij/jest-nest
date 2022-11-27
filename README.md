[![Known Vulnerabilities](https://snyk.io/test/github/teunmooij/jest-nest/badge.svg)](https://snyk.io/test/github/teunmooij/jest-nest)
[![codecov](https://codecov.io/gh/teunmooij/jest-nest/branch/main/graph/badge.svg?token=RD1WJQ36WN)](https://codecov.io/gh/teunmooij/jest-nest)
[![npm version](https://badge.fury.io/js/jest-nest.svg)](https://badge.fury.io/js/jest-nest)

# jest-nest

jest mock for nested and curried functions

## Installation

```shell
$ npm install jest-nest
```

## Configuration

Create a `setup.ts` file:

```typescript
import 'jest-nest';
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

or

```typescript
import { fnNested, nestingArgs, NestingArgs } from 'jest-nest';

it('expects nested function call', () => {
  const nestedFn = fnNested(3, () => 'my return value');

  const result = nestedFn('a', 'b')({ foo: 'bar', baz: 1 })('c');

  const expectedArgs: NestingArgs = nestingArgs('a', 'b')(expect.objectContaining({ foo: expect.any(String) }))('c');

  expect(nestedFn).toHaveBeenNestedCalledWith(expectedArgs);
  expect(result).toBe('my return value');
});
```
