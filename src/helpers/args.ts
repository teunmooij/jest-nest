export type NestingArgs = {
  /**
   * Helper for fluent creation of expected nested arguments. Call as a function or as a map of functions like you expect your mock to have been called.
   * @param {...any[]} args expected arguments at current level of depth
   * @returns {NestingArgs} Arguments up to the next level of depth
   * @example nest.args.foo('bar').baz() // expect object mock to have been called on property foo with arguments 'bar', then nested on property baz
   * @example nest.args('a')('b') // expect nesting or curry mock to have been called first with argument 'a' and then nested with argument 'b'
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
