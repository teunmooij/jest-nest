import { CallState } from '../../src';

describe('object mock tests', () => {
  it('supports making nested calls', () => {
    const mock = nest.obj();

    mock.abc(1, 2).cde('a').fgh();
  });

  it('records the top level calls', () => {
    const mock = nest.obj();

    mock.abc(1, 2);
    expect(mock).toHaveBeenCalledWith('abc', 1, 2);
  });

  it('records nested calls', () => {
    const mock = nest.obj();
    mock.abc(1, 2).cde('a').fgh();

    expect(mock).toHaveBeenCalledWith('abc', 1, 2);
    expect(mock.mock.results[0].value).toHaveBeenCalledWith('cde', 'a');

    expect(mock).toHaveBeenNestedCalledWith([['abc', 1, 2], ['cde', 'a'], ['fgh']]);
  });

  it('records multiple nested calls', () => {
    const mock = nest.obj();
    const child = mock.foo(1, 2);
    child.bar('a');
    child.baz('b');
    mock.bar('c');

    expect(mock).toHaveBeenNestedCalledWith([
      ['foo', 1, 2],
      ['bar', 'a'],
    ]);
    expect(mock).toHaveBeenNestedCalledWith([
      ['foo', 1, 2],
      ['baz', 'b'],
    ]);
    expect(mock).toHaveBeenNestedCalledWith([['bar', 'c']]);

    expect(mock).not.toHaveBeenNestedCalledWith([
      ['bar', 'c'],
      ['bar', 'a'],
    ]);
    expect(mock).not.toHaveBeenNestedCalledWith([
      ['foo', 1, 2],
      ['bar', 'b'],
    ]);
  });

  it('returns a given value at a given path', () => {
    const value = 42;
    const path = ['foo', 'bar'] as const;
    const mock = nest.obj();
    const same = mock.mockReturnValueAt(path, value);

    const result = mock.foo('a').bar('b');

    expect(result).toBe(42);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenNestedCalledWith([
      ['foo', 'a'],
      ['bar', 'b'],
    ]);
    expect(same).toBe(mock);
  });

  it('resolves a given value at a given path', async () => {
    const value = 42;
    const path = ['foo', 'bar'] as const;
    const mock = nest.obj();
    const same = mock.mockResolvedValueAt(path, value);

    const result = mock.foo('a').bar('b');

    expect(result).toBeInstanceOf(Promise);
    expect(await result).toBe(42);

    expect(same).toBe(mock);
  });

  it('rejects a given value at a given path', async () => {
    const value = 'oops';
    const path = ['foo', 'bar'] as const;
    const mock = nest.obj();
    const same = mock.mockRejectedValueAt(path, value);

    const result = mock.foo('a').bar('b');

    expect(result).toBeInstanceOf(Promise);
    await expect(result).rejects.toMatch('oops');

    expect(same).toBe(mock);
  });

  it('gets a given value at a given path', async () => {
    const value = 'baz';
    const path = ['foo', 'bar'] as const;
    const mock = nest.obj();
    const same = mock.mockGetValueAt(path, value);

    const result = mock.foo('a').bar;

    expect(result).toBe('baz');

    expect(same).toBe(mock);
  });

  it('sets a given implementation at a given path', () => {
    const implementation = jest.fn().mockReturnValue(42);
    const path = ['foo', 'bar'] as const;
    const mock = nest.obj();
    const same = mock.mockImplementationAt(path, implementation);

    const result = mock.foo('a').bar('b');

    expect(result).toBe(42);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenNestedCalledWith([
      ['foo', 'a'],
      ['bar', 'b'],
    ]);

    expect(implementation).toHaveBeenCalledTimes(1);
    expect(implementation).toHaveBeenCalledWith('b');
    expect(same).toBe(mock);
  });

  it('makes the callPath available to the implementation', () => {
    const implementation = jest.fn(function (this: CallState, arg1: string) {
      expect(arg1).toBe('d');
      expect(this.callPath).toEqual([
        ['foo', 'a'],
        ['bar', 'b', 'c'],
      ]);
      return 42;
    });
    const path = ['foo', 'bar', 'baz'] as const;
    const mock = nest.obj();
    const same = mock.mockImplementationAt(path, implementation);

    const result = mock.foo('a').bar('b', 'c').baz('d');

    expect(result).toBe(42);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenNestedCalledWith([
      ['foo', 'a'],
      ['bar', 'b', 'c'],
      ['baz', 'd'],
    ]);

    expect(implementation).toHaveBeenCalledTimes(1);
    expect(implementation).toHaveBeenCalledWith('d');
    expect(same).toBe(mock);
  });
});
