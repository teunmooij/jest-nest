describe('toHaveBeenNestedCalledWith tests', () => {
  it('passes when expected nested arguments match', () => {
    const nestedFn = nest.fn(3);
    nestedFn('a')()('b');

    expect(nestedFn).toHaveBeenNestedCalledWith([['a'], [], ['b']]);
  });

  it('fails when expected nested arguments do not match', () => {
    const nestedFn = nest.fn(3);
    nestedFn('a')()('b');

    const test = () => expect(nestedFn).toHaveBeenNestedCalledWith([['a'], [], ['c']]);

    expect(test).toThrow(`Expected calls to match
Expected: fn(a)()(c)
Actual:
  fn(a)()(b)`);
  });

  it('fails when root function was never called', () => {
    const nestedFn = nest.fn();

    const test = () => expect(nestedFn).toHaveBeenNestedCalledWith(nest.args('a'));
    expect(test).toThrow(`Expected the nested function to have been called
Expected: fn(a)
Actual: Number of calls: 0`);
  });

  it('passes when expecting nested arguments not to match', () => {
    const nestedFn = nest.fn();
    nestedFn('a')('b');

    expect(nestedFn).not.toHaveBeenNestedCalledWith([['a'], ['c']]);
  });

  it('fails when expecting nested arguments match but are expected not to match', () => {
    const nestedFn = nest.fn();
    nestedFn('a')('b');

    const test = () => expect(nestedFn).not.toHaveBeenNestedCalledWith([['a'], ['b']]);

    expect(test).toThrow('Expected calls not to match fn(a)(b)');
  });

  it('paases when only part of the chain is expected to match', () => {
    const nestedFn = nest.fn(3);
    nestedFn('a')('b')('c');

    expect(nestedFn).toHaveBeenNestedCalledWith([['a'], ['b']]);
  });

  it('support nestingArgs', () => {
    const nestedFn = nest.fn();
    nestedFn('a', 'b')('c');
    expect(nestedFn).toHaveBeenNestedCalledWith(nest.args('a', 'b')('c'));
  });

  it('supports jest matchers as expected arguments', () => {
    const nestedFn = nest.fn();
    nestedFn({ foo: 'bar' })('b');

    expect(nestedFn).toHaveBeenNestedCalledWith(nest.args(expect.objectContaining({ foo: expect.any(String) }))('b'));
  });

  it('throws if expected is not a nesting mock', () => {
    const test = () => expect(jest.fn()).toHaveBeenNestedCalledWith([]);

    expect(test).toThrow('Actual must be a Nesting mock.');
  });

  it('throws if expected is not an array', () => {
    const nestedFn = nest.fn();
    const test = () => expect(nestedFn).toHaveBeenNestedCalledWith('a' as any);

    expect(test).toThrow('Args must be of type NestingArgs or any[][].');
  });

  it('also works on curry mocks', () => {
    const curryFn = nest.curry(3);
    curryFn('a', 'b')('c');

    expect(curryFn.uncurried).toHaveBeenCalledWith('a', 'b', 'c');
    expect(curryFn).toHaveBeenNestedCalledWith(nest.args('a', 'b')('c'));
    expect(() => {
      expect(curryFn).toHaveBeenNestedCalledWith(nest.args('a')('b', 'c'));
    }).toThrow(`Expected calls to match
Expected: fn(a)(b, c)
Actual:
  fn(a, b)(c)`);
  });
});
