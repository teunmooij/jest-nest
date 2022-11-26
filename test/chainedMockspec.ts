import { fnCurried } from '../src';

describe('chainedMock tests', () => {
  it('creates a curried mock', () => {
    const x = fnCurried();
    x('a')('b');

    expect(x).toHaveBeenCalledTimes(1);
    expect(x).toHaveBeenCalledWith('a');
    expect(x.mock.results[0].value).toHaveBeenCalledWith('b');
  });

  it('it returns a curried result', () => {
    const x = fnCurried(4, () => 'done');
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
    const f = fnCurried(3);
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
});
