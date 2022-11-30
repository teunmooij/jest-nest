import { NestingMock } from './nestingMock';

/**
 * jest Mock for curried functions
 */
export type CurryMock = NestingMock & {
  /**
   * Gets the uncurried inner jest.Mock
   * @readonly
   * @remarks contains registrations for all combinations of calls resulting in a full argument list.
   * @see global.nest.args to create partial call expectations
   */
  readonly uncurried: jest.Mock;
};

const fnCurriedInternal = (length: number, mockImplementation: jest.Mock, callPath: any[][] = []): CurryMock => {
  const root = jest.fn((...args) => {
    const baseArgs = callPath.flat();
    if (baseArgs.length + args.length >= length) {
      return mockImplementation(...baseArgs, ...args);
    }
    return fnCurriedInternal(length, mockImplementation, [...callPath, args]);
  }) as CurryMock;

  Object.defineProperties(root, {
    callPath: { get: () => callPath },
    uncurried: { get: () => mockImplementation },
  });

  return root;
};

/**
 * Creates a jest mock for a curried function
 * @param {(...args: any[]) => any} mockImplementation Implementation of this mock or function to spy on
 * @param {number} [arity] total number of arguments for the curried function, provide only if it can't be derived from 'mockImplementation'
 * @returns {CurryMock} the mock
 */
export function fnCurried(mockImplementation: (...args: any[]) => any, arity?: number): CurryMock;
/**
 * Creates a mock for a curried function
 * @param {number} arity total number of arguments for the curried function
 * @returns {CurryMock} the mock
 */
export function fnCurried(arity: number): CurryMock;
export function fnCurried(option: ((...args: any[]) => any) | number, arity?: number): CurryMock {
  if (typeof option === 'function') {
    const { length } = option;
    return fnCurriedInternal(arity || length, jest.fn(option));
  }
  return fnCurriedInternal(option, jest.fn());
}
