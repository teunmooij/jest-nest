describe('nesting args tests', () => {
  it('is an empty args array', () => {
    const args = nest.args.args;

    expect(args).toEqual([]);
  });

  it('creates a nested args array', () => {
    const args = nest.args('a', 'b')()('c');
    expect(args.args).toEqual([['a', 'b'], [], ['c']]);
  });

  it('does not alter the nesting args', () => {
    const args = nest.args('a');
    const b = args('b');
    const c = args('c');

    expect(b.args).toEqual([['a'], ['b']]);
    expect(c.args).toEqual([['a'], ['c']]);
    expect(args.args).toEqual([['a']]);
  });

  it('creates args for object mock', () => {
    const args = nest.args.foo('a').bar('b')('c')('d').baz('e');

    expect(args.args).toEqual([['foo', 'a'], ['bar', 'b'], ['c'], ['d'], ['baz', 'e']]);
  });
});
