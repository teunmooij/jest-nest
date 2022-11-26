# jest-nest

jest mock for nested and curried functions

## Installation

```shell
$ npm install jest-nest
```

## Usage

```typescript
it('expects nested function call', () => {
  const nestedFn = nest.fn(3, () => 'my return value');

  const result = nestedFn('a', 'b')({ foo: 'bar' })('c');

  expect(nestedFn).toHaveBeenNestedCalledWith(nest.args('a', 'b')({ foo: expect.any(String) })('c'));
  expect(result).toBe('my return value');
});
```
