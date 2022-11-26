export type NestingArgs = {
  (...args: any[]): NestingArgs;
  args: any[][];
};

const createNestingArgs = (args: any[][]): NestingArgs => {
  const fn = (...next: any[]) => createNestingArgs([...args, next]) as NestingArgs;
  fn.args = args;
  return fn;
};

export const nestingArgs = (...args: any[]) => createNestingArgs([args]);
