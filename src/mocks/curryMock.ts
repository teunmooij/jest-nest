import { NestingMock } from './nestingMock';

export type CurryMock = NestingMock & {
  uncurried: jest.Mock;
};

const fnCurriedInternal = (length: number, mockImplementation: jest.Mock, callPath: any[][] = []): CurryMock => {
  const root = jest.fn((...args) => {
    const baseArgs = callPath.flat();
    if (baseArgs.length + args.length >= length) {
      return mockImplementation(...baseArgs, ...args);
    }
    return fnCurriedInternal(length, mockImplementation, [...callPath, args]);
  }) as CurryMock;
  root.callPath = callPath;
  root.uncurried = mockImplementation;

  return root;
};

export function fnCurried(mockImplementation: (...args: any[]) => any): CurryMock;
export function fnCurried(argumentLength: number): CurryMock;
export function fnCurried(option: ((...args: any[]) => any) | number): CurryMock {
  if (typeof option === 'function') {
    const { length } = option;
    return fnCurriedInternal(length, jest.fn(option));
  }
  return fnCurriedInternal(option, jest.fn());
}
