export {};
import { fnNested, NestingMock } from './mocks/nestingMock';
import { fnCurried, CurryMock } from './mocks/curryMock';
import { objNested, ObjectMock, CallState } from './mocks/objectMock';
import { nestingArgs, NestingArgs } from './helpers/args';

export { fnNested, NestingMock, fnCurried, CurryMock, nestingArgs, NestingArgs, objNested, ObjectMock, CallState };

export { toHaveBeenNestedCalledWith } from './matchers/toHaveBeenNestedCalledWith';
export { init } from './init';

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Performs expectation on the nested mock the have been called
       * @param {NestingArgs|any[][]} args Consecutive args expected to have been called on the mock
       */
      toHaveBeenNestedCalledWith(nestedArgs: NestingArgs | any[][]): R;
      /**
       * Performs expectation on the nested mock the have been called
       * @param {NestingArgs|any[][]} args Consecutive args expected to have been called on the mock
       */
      toBeNestedCalledWith(nestedArgs: NestingArgs | any[][]): R;
    }
  }

  // eslint-disable-next-line no-var
  var nest: {
    fn: typeof fnNested;
    chain: typeof fnNested;
    curry: typeof fnCurried;
    obj: typeof objNested;
    args: typeof nestingArgs;
  };
}
