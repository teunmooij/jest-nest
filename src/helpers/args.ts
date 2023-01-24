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
} & Record<string | number | symbol, (...args: any[]) => NestingArgs>;

const createNestingArgs = (args: any[][]): NestingArgs => {
  const fn = (...next: any[]) => createNestingArgs([...args, next]);
  fn.args = args;

  return new Proxy(fn, {
    apply: (target, _thisArg, args) => target(...args),
    get: (target, name) => {
      if (name === 'args') return target.args;
      return (...args: any[]) => target(name, ...args);
    },
  }) as unknown as NestingArgs;
};

/**
 * Helper for fluent creation of expected nested arguments
 * @param {...any[]} args expected arguments for the top level call
 * @returns {NestingArgs} Arguments for the next level of depth
 */
export const nestingArgs = createNestingArgs([]);
