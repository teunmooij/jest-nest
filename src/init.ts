import { fnNested } from './mocks/nestingMock';
import { fnCurried } from './mocks/curryMock';
import { nestingArgs, NestingArgs } from './helpers/args';
import { toHaveBeenNestedCalledWith } from './matchers/toHaveBeenNestedCalledWith';

export const init = () => {
  expect.extend({
    toHaveBeenNestedCalledWith,
    toBeNestedCalledWith: toHaveBeenNestedCalledWith,
  });

  globalThis.nest = {
    fn: fnNested,
    curry: fnCurried,
    args: nestingArgs,
  };
};

export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Performs expectation on the nested mock the have been called
       * @param {NestingArgs|any[][]} args Consecutive args expected to have been called on the mock
       */
      toHaveBeenNestedCalledWith(nestedArgs: NestingArgs | any[][]): R;
    }
  }

  // eslint-disable-next-line no-var
  var nest: {
    fn: typeof fnNested;
    curry: typeof fnCurried;
    args: typeof nestingArgs;
  };
}
