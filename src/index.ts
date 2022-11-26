import './matcher';
import { fnNested } from './chainedMock';
import { nestingArgs, NestingArgs } from './args';

export {};
declare global {
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
