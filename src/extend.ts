import { expect } from '@jest/globals';
import { ExpectationResult, MatcherState } from 'expect';
import { NestingMock } from './chainedMock';

const isNestingMock = (value: unknown): value is NestingMock => Boolean(value) && 'callPath' in (value as any);

const getBestMatch = (context: MatcherState, actual: NestingMock, args: any[][]) => {};

function toHaveBeenNestedCalledWith(this: MatcherState, actual: unknown, args: any[][]): ExpectationResult {
  if (!isNestingMock(actual)) {
    throw new Error('Actual must be a Nesting mock');
  }
  if (!Array.isArray(args)) {
    throw new Error('Args must be of type Array<Array<any>>');
  }

  const match = getBestMatch(this, actual, args);

  return {
    message: () => 'ok',
    pass: true,
  };
}

expect.extend({
  toHaveBeenNestedCalledWith,
  toBeNestedCalledWith: toHaveBeenNestedCalledWith,
});
