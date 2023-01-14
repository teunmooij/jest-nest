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
});
