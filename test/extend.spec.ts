describe('toHaveBeenNestedCalledWith tests', () => {
  it('expects to pass nested expectation', () => {
    const curryFn = nest.fn();
    curryFn('a')('b');

    expect(curryFn).toHaveBeenNestedCalledWith([['a'], ['b']]);
  });
});
