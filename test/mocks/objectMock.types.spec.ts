import { ObjectMock, WithPath } from '../../src/mocks/objectMock.types';
import { expectTypes } from '../utils';

describe('type tests', () => {
  it('supports adding simple and object types', () => {
    // Arrange
    type Shape = { foo: { bar: string; baz: { fred: number } } };

    type ExpectedWithQux = { foo: { bar: string; baz: { fred: number } }; qux: string };
    type ExpectedWithQuux = { foo: { bar: string; baz: { fred: number; quux: string } }; qux: string };
    type ExpectedWithCorge = { foo: { bar: string; baz: { fred: number; quux: string }; corge: boolean }; qux: string };
    type ExpectedWithGarply = {
      foo: { bar: string; baz: { fred: number } };
      grault: { graply: number[] };
    };

    // Act
    type ActualWithQux = WithPath<Shape, true, ['qux'], string>;
    type ActualWithQuux = WithPath<ActualWithQux, true, ['foo', 'baz', 'quux'], string>;
    type ActualWithCorge = WithPath<ActualWithQuux, true, ['foo', 'corge'], boolean>;
    type ActualWithGarply = WithPath<Shape, true, ['grault'], { graply: number[] }>;

    // Assert
    expectTypes<ActualWithQux, ExpectedWithQux>().toBeIdentical;
    expectTypes<ActualWithQuux, ExpectedWithQuux>().toBeIdentical;
    expectTypes<ActualWithCorge, ExpectedWithCorge>().toBeIdentical;
    expectTypes<ActualWithGarply, ExpectedWithGarply>().toBeIdentical;
  });

  it('allows nested subpaths under non-existing keys', () => {
    type Shape = { foo: { bar: string; baz: { fred: number } } };

    type ExpectedWithGarply = {
      foo: { bar: string; baz: { fred: number } };
      qux: jest.Mock<ObjectMock<{ grault: jest.Mock<ObjectMock<{ graply: number[] }, true>> }, true>>;
    };

    type ActualWithGarply = WithPath<Shape, true, ['qux', 'grault', 'graply'], number[]>;

    expectTypes<ActualWithGarply, ExpectedWithGarply>().toBeIdentical;
  });

  it('extends paths as the return types of the mock functions', () => {
    // Arrange
    type Shape = { foo: () => { bar: (arg: number) => string; baz: (arg0: boolean, arg1: string) => { fred: number } } };
    type ExpectedWithQux = {
      foo: () => { bar: (arg: number) => string; baz: (arg0: boolean, arg1: string) => { fred: number } };
      qux: string;
    };
    type ExpectedWithQuux = {
      foo: () => { bar: (arg: number) => string; baz: (arg0: boolean, arg1: string) => { fred: number; quux: string } };
      qux: string;
    };
    type ExpectedWithCorge = {
      foo: () => {
        bar: (arg: number) => string;
        baz: (arg0: boolean, arg1: string) => { fred: number; quux: string };
        corge: (arg: string) => boolean;
      };
      qux: string;
    };
    type ExpectedWithGarply = {
      foo: () => { bar: (arg: number) => string; baz: (arg0: boolean, arg1: string) => { fred: number } };
      grault: { graply: number[] };
    };

    // Act
    type ActualWithQux = WithPath<Shape, true, ['qux'], string>;
    type ActualWithQuux = WithPath<ActualWithQux, true, ['foo', 'baz', 'quux'], string>;
    type ActualWithCorge = WithPath<ActualWithQuux, true, ['foo', 'corge'], (arg: string) => boolean>;
    type ActualWithGarply = WithPath<Shape, true, ['grault'], { graply: number[] }>;

    // Assert
    expectTypes<ActualWithQux, ExpectedWithQux>().toBeIdentical;
    expectTypes<ActualWithQuux, ExpectedWithQuux>().toBeIdentical;
    expectTypes<ActualWithCorge, ExpectedWithCorge>().toBeIdentical;
    expectTypes<ActualWithGarply, ExpectedWithGarply>().toBeIdentical;
  });
});
