import { NestingMock } from '../../src';

describe('nestingMock tests', () => {
  it('creates a curried mock', () => {
    const x = nest.fn();
    x('a')('b');

    expect(x).toHaveBeenCalledTimes(1);
    expect(x).toHaveBeenCalledWith('a');
    expect(x.mock.results[0].value).toHaveBeenCalledWith('b');
  });

  it('it returns a curried result', () => {
    const x = nest.fn(4, () => 'done');
    const y = x('a')('b');
    const z = y('c')('d');

    expect(x).toHaveBeenCalledTimes(1);
    expect(z).toBe('done');
    expect(y.callPath).toEqual([['a'], ['b']]);
    expect(x).toHaveBeenCalledWith('a');
    expect(x.mock.results[0].value).toHaveBeenCalledWith('b');
    expect(x.mock.results[0].value.mock.results[0].value).toHaveBeenCalledWith('c');
  });

  it('captures multiple chains', () => {
    const f = nest.fn(3);
    const x = f('a');
    x('c');
    const y = f('b');
    y('d');

    expect(f).toHaveBeenCalledTimes(2);
    expect(f).toHaveBeenNthCalledWith(1, 'a');
    expect(f).toHaveBeenNthCalledWith(2, 'b');

    expect(x).toHaveBeenCalledTimes(1);
    expect(x).toHaveBeenCalledWith('c');

    expect(y).toHaveBeenCalledTimes(1);
    expect(y).toHaveBeenCalledWith('d');
  });

  it('throws when depth is smaller than 1', () => {
    const test = () => nest.fn(0);
    expect(test).toThrow('Depth must be a whole number greater than 0.');
  });

  it('throws when depth is not a whole number', () => {
    const test = () => nest.fn(2.1);
    expect(test).toThrow('Depth must be a whole number greater than 0.');
  });

  it('provides the tail access to the callPath', () => {
    const tail = jest.fn(function (this: NestingMock, arg1: string) {
      expect(arg1).toBe('b');
      expect(this.callPath).toEqual([['a']]);
    });

    const f = nest.fn(2, tail);
    f('a')('b');

    expect(tail).toHaveBeenCalledTimes(1);
    expect(tail).toHaveBeenCalledWith('b');
  });
});
