import './matcher';
import { fnNested, NestingMock } from './mocks/nestingMock';
import { fnCurried, CurryMock } from './mocks/curryMock';
import { nestingArgs, NestingArgs } from './args';

export {};
declare global {
  // eslint-disable-next-line no-var
  var nest: {
    fn: typeof fnNested;
    curry: typeof fnCurried;
    args: typeof nestingArgs;
  };
}

globalThis.nest = {
  fn: fnNested,
  curry: fnCurried,
  args: nestingArgs,
};

export { fnNested, fnCurried, nestingArgs, NestingArgs, NestingMock, CurryMock };
