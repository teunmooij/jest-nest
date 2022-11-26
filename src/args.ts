export type NestingArgs = {
  (...args: any[]): NestingArgs;
  args: any[][];
};

// export function nestingArgs(this: any, ...args: any[]): NestingArgs {
//   console.log(this)
//   const oldArgs = Array.isArray(this?.args) ? this.args : [];

//   const fn = nestingArgs as NestingArgs;
//   fn.args = [...oldArgs, args];
//   return fn;
// }

const createNestingArgs = (args: any[][]): NestingArgs => {
  const fn = (...next: any[]) => createNestingArgs([...args, next]) as NestingArgs;
  fn.args = args;
  return fn;
};

export const nestingArgs = (...args: any[]) => createNestingArgs([args]);
