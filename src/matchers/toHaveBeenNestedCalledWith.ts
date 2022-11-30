import { ExpectationResult, MatcherState, MatcherUtils } from 'expect';
import { NestingArgs } from '../helpers/args';
import { NestingMock } from '../mocks/nestingMock';

const isNestingMock = (value: unknown): value is NestingMock => Boolean(value) && 'callPath' in (value as any);
const isNestingArgs = (value: unknown): value is NestingArgs => Boolean(value) && Array.isArray((value as any).args);

const getCalls = (actual: NestingMock, prev: any[][] = []): any[][][] => {
  const { calls, results } = actual.mock;

  return calls
    .map((call, index) => ({
      args: call,
      result: results[index],
    }))
    .flatMap(call => {
      const actualArgs = [...prev, call.args];
      if (call.result.type === 'return' && isNestingMock(call.result.value)) {
        const result = getCalls(call.result.value, actualArgs);
        if (result.length) return result;
      }
      return [actualArgs];
    });
};

const getMatch = (context: MatcherState & MatcherUtils, actual: any[][], expected: any[][]): any[][] => {
  const sharedLength = Math.min(actual.length, expected.length);
  let index = 0;
  while (index < sharedLength) {
    const isMatch = context.equals(actual[index], expected[index]);
    if (!isMatch) break;
    index++;
  }

  return actual.slice(0, index);
};

const getMatches = (context: MatcherState & MatcherUtils, actual: any[][][], expected: any[][]): any[][][] =>
  actual.map(call => getMatch(context, call, expected)).filter(match => match.length);

const printCall = (args: any[][]) => `fn(${args.map(call => call.join(', ')).join(')(')})`;

/**
 * Performs expectation on the nested mock the have been called
 * @param {NestingMock} actual The mock on which to verify the expectations
 * @param {NestingArgs|any[][]} args Consecutive args expected to have been called on the mock
 */
export function toHaveBeenNestedCalledWith(
  this: MatcherState & MatcherUtils,
  actual: unknown,
  args: NestingArgs | any[][],
): ExpectationResult {
  if (!isNestingMock(actual)) {
    throw new Error('Actual must be a Nesting mock.');
  }

  const expected = isNestingArgs(args) ? args.args : args;

  if (!Array.isArray(expected)) {
    throw new Error('Args must be of type NestingArgs or any[][].');
  }

  const calls = getCalls(actual);
  const matches = getMatches(this, calls, expected);

  if (!calls.length) {
    return {
      message: () => `Expected the nested function to have been called
Expected: ${printCall(expected)}
Actual: Number of calls: 0`,
      pass: false,
    };
  }

  const isMatch = matches.find(m => m.length === expected.length);

  if (isMatch) {
    return {
      message: () => `Expected calls not to match ${printCall(expected)}`,
      pass: true,
    };
  }

  return {
    message: () => `Expected calls to match
Expected: ${printCall(expected)}
Actual:
  ${calls.map(m => printCall(m)).join('\n  ')}`,
    pass: false,
  };
}
