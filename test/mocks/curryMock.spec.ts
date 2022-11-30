describe('curryMock tests', () => {
  it('creates a curried mock', () => {
    const x = nest.curry(2);
    x('a')('b');

    expect(x).toHaveBeenCalledTimes(1);
    expect(x).toHaveBeenCalledWith('a');
    expect(x.mock.results[0].value).toHaveBeenCalledWith('b');
    expect(x.uncurried).toHaveBeenCalledTimes(1);
    expect(x.uncurried).toHaveBeenCalledWith('a', 'b');
  });

  it('it returns a curried result', () => {
    const x = nest.curry((a, b, c, d) => 'done');
    const y = x('a')('b');
    const z = y('c')('d');

    expect(x).toHaveBeenCalledTimes(1);
    expect(z).toBe('done');
    expect(y.callPath).toEqual([['a'], ['b']]);
    expect(x).toHaveBeenCalledWith('a');
    expect(x.mock.results[0].value).toHaveBeenCalledWith('b');
    expect(x.mock.results[0].value.mock.results[0].value).toHaveBeenCalledWith('c');
    expect(x.uncurried).toHaveBeenCalledTimes(1);
    expect(x.uncurried).toHaveBeenCalledWith('a', 'b', 'c', 'd');
  });

  it('captures multiple chains', () => {
    const f = nest.curry(2);
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
    expect(x.uncurried).toHaveBeenCalledTimes(2);
    expect(x.uncurried).toHaveBeenCalledWith('a', 'c');
    expect(x.uncurried).toHaveBeenCalledWith('b', 'd');
  });

  it('supports full currying', () => {
    const f = nest.curry(4);
    f('a')('b')('c')('d');
    f('e', 'f')('g', 'h');
    f('i', 'j', 'k')('l');

    expect(f.uncurried).toHaveBeenCalledTimes(3);
    expect(f.uncurried).toHaveBeenNthCalledWith(1, 'a', 'b', 'c', 'd');
    expect(f.uncurried).toHaveBeenNthCalledWith(2, 'e', 'f', 'g', 'h');
    expect(f.uncurried).toHaveBeenNthCalledWith(3, 'i', 'j', 'k', 'l');
  });

  it('overrides the arity', () => {
    const x = nest.curry((a, b, c, d) => 'done', 5);
    const y = x('a')('b');
    const z = y('c')('d');

    expect(typeof z).toBe('function');
    expect(z('a')).toBe('done');
  });
});
