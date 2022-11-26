// import './extent';
import { fnNested } from './chainedMock';

export {};
declare global {
  namespace jest {
    // interface Matchers<R> {
    //   myCustomMatcher(): R;
    // }
  }

  // eslint-disable-next-line no-var
  var nest: {
    fn: typeof fnNested;
  };
}

globalThis.nest = {
  fn: fnNested,
};

export { fnNested };
