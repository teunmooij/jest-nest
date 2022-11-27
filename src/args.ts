export type NestingArgs = {
  /**
   * @param {...any[]} args expected arguments at current level of depth
   * @returns {NestingArgs} Arguments up to the next level of depth
   */
  (...args: any[]): NestingArgs;
  /**
   * List of the expected call arguments for each level
   */
  args: any[][];
};

const createNestingArgs = (args: any[][]): NestingArgs => {
  const fn = (...next: any[]) => createNestingArgs([...args, next]) as NestingArgs;
  fn.args = args;
  return fn;
};

/**
 * Helper for fluent creation of expected nested arguments
 * @param {...any[]} args expected arguments for the top level call
 * @returns {NestingArgs} Arguments for the next level of depth
 */
export const nestingArgs = (...args: any[]) => createNestingArgs([args]);
