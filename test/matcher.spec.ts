describe('toHaveBeenNestedCalledWith tests', () => {
  it('passes when expected nested arguments match', () => {
    const curryFn = nest.fn();
    curryFn('a')('b');

    expect(curryFn).toHaveBeenNestedCalledWith([['a'], ['b']]);
  });

  it('fails when expected nested arguments do not match', () => {
    const curryFn = nest.fn();
    curryFn('a')('b');

    const test = () => expect(curryFn).toHaveBeenNestedCalledWith([['a'], ['c']]);

    expect(test).toThrow('Expected to match, but found ...');
  });

  it('passes when expecting nested arguments not to match', () => {
    const curryFn = nest.fn();
    curryFn('a')('b');

    expect(curryFn).not.toHaveBeenNestedCalledWith([['a'], ['c']]);
  });

  it('fails when expecting nested arguments match but are expected not to match', () => {
    const curryFn = nest.fn();
    curryFn('a')('b');

    const test = () => expect(curryFn).not.toHaveBeenNestedCalledWith([['a'], ['b']]);

    expect(test).toThrow('Expected not to match');
  });

  it('paases when only part of the chain is expected to match', () => {
    const curryFn = nest.fn(3);
    curryFn('a')('b')('c');

    expect(curryFn).toHaveBeenNestedCalledWith([['a'], ['b']]);
  });

  it('support nestingArgs', () => {
    const curryFn = nest.fn();
    curryFn('a', 'b')('c');
    expect(curryFn).toHaveBeenNestedCalledWith(nest.args('a', 'b')('c'));
  });

  it('supports jest matchers as expected arguments', () => {
    const curryFn = nest.fn();
    curryFn({ foo: 'bar' })('b');

    expect(curryFn).toHaveBeenNestedCalledWith(nest.args(expect.objectContaining({ foo: expect.any(String) }))('b'));
  });
});
