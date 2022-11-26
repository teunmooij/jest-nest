export {};
declare global {
  namespace jest {
    // interface Matchers<R> {
    //   myCustomMatcher(): R;
    // }
  }
}

export * from './chainedMock';
