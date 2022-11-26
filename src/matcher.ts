import { expect } from '@jest/globals';
import { ExpectationResult, MatcherState, MatcherUtils } from 'expect';
import { NestingArgs } from './args';
import { NestingMock } from './chainedMock';

const isNestingMock = (value: unknown): value is NestingMock => Boolean(value) && 'callPath' in (value as any);
const isNestingArgs = (value: unknown): value is NestingArgs => Boolean(value) && Array.isArray((value as any).args);

const getMatches = (context: MatcherState & MatcherUtils, actual: NestingMock, args: any[][], prev: any[][] = []): any[][] => {
  const { calls, results } = actual.mock;
  const [current, ...rest] = args;

  return calls
    .map((call, index) => ({
      args: call,
      result: results[index],
    }))
    .filter(call => context.equals(call.args, current))
    .flatMap(call => {
      const actualArgs = [...prev, call.args];
      if (rest.length && call.result.type === 'return' && isNestingMock(call.result.value)) {
        const result = getMatches(context, call.result.value, rest, actualArgs);
        if (result.length) return result;
      }
      return [actualArgs];
    });
};

function toHaveBeenNestedCalledWith(
  this: MatcherState & MatcherUtils,
  actual: unknown,
  args: any[][] | NestingArgs,
): ExpectationResult {
  if (!isNestingMock(actual)) {
    throw new Error('Actual must be a Nesting mock');
  }

  const argsArray = isNestingArgs(args) ? args.args : args;

  if (!Array.isArray(argsArray)) {
    throw new Error('Args must be of type Array<Array<any>>');
  }

  const matches = getMatches(this, actual, argsArray);
  const isMatch = matches.find(m => m.length === argsArray.length);

  if (isMatch) {
    return {
      message: () => 'Expected not to match',
      pass: true,
    };
  }

  return {
    message: () => 'Expected to match, but found ...',
    pass: false,
  };
}

expect.extend({
  toHaveBeenNestedCalledWith,
  toBeNestedCalledWith: toHaveBeenNestedCalledWith,
});

export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenNestedCalledWith(nestedArgs: any[][] | NestingArgs): R;
    }
  }
}
