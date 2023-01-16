import { WithPath } from '../../src/helpers/types';
import { expectTypes } from '../utils';

describe('type tests', () => {
  it('compiles if all types match', () => {
    // Arrange
    type Shape = { foo: { bar: string; baz: { fred: number } } };
    type ExpectedWithQux = { foo: { bar: string; baz: { fred: number } }; qux: string };
    type ExpectedWithQuux = { foo: { bar: string; baz: { fred: number; quux: string } }; qux: string };
    type ExpectedWithCorge = { foo: { bar: string; baz: { fred: number; quux: string }; corge: boolean }; qux: string };
    type ExpectedWithGarply = {
      foo: { bar: string; baz: { fred: number; quux: string }; corge: boolean };
      qux: string;
      grault: { graply: number[] };
    };

    // Act
    type ActualWithQux = WithPath<Shape, ['qux'], string>;
    type ActualWithQuux = WithPath<ActualWithQux, ['foo', 'baz', 'quux'], string>;
    type ActualWithCorge = WithPath<ActualWithQuux, ['foo', 'corge'], boolean>;
    type ActualWithGarply = WithPath<ActualWithCorge, ['grault', 'graply'], number[]>;

    // Assert
    expectTypes<ActualWithQux, ExpectedWithQux>().toBeIdentical;
    expectTypes<ActualWithQuux, ExpectedWithQuux>().toBeIdentical;
    expectTypes<ActualWithCorge, ExpectedWithCorge>().toBeIdentical;
    expectTypes<ActualWithGarply, ExpectedWithGarply>().toBeIdentical;
  });
});
