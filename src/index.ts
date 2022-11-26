import './extend';
import { fnNested } from './chainedMock';
import { nestingArgs, NestingArgs } from './args';

export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenNestedCalledWith(nestedArgs: any[][]): R;
    }
  }

  // eslint-disable-next-line no-var
  var nest: {
    fn: typeof fnNested;
    args: typeof nestingArgs;
  };
}

globalThis.nest = {
  fn: fnNested,
  args: nestingArgs,
};

export { fnNested, nestingArgs, NestingArgs };
