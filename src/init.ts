import { fnNested } from './mocks/nestingMock';
import { fnCurried } from './mocks/curryMock';
import { objNested } from './mocks/objectMock';

import { nestingArgs } from './helpers/args';
import { toHaveBeenNestedCalledWith } from './matchers/toHaveBeenNestedCalledWith';

export const init = () => {
  expect.extend({
    toHaveBeenNestedCalledWith,
    toBeNestedCalledWith: toHaveBeenNestedCalledWith,
  });

  global.nest = {
    fn: fnNested,
    chain: fnNested,
    curry: fnCurried,
    obj: objNested,
    args: nestingArgs,
  };
};
