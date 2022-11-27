export type NestingMock = jest.Mock & {
  callPath: any[][];
};

const fnNestedInternal = (depth: number, tailImplementation?: (...args: any[]) => any, callPath: any[][] = []): NestingMock => {
  if (depth < 1 || depth % 1 !== 0) throw new Error('Depth must be a whole number greater than 0.');

  if (depth === 1) {
    const tail = jest.fn(tailImplementation) as NestingMock;
    tail.callPath = callPath;
    return tail;
  }

  const root = jest.fn((...args) => fnNestedInternal(depth - 1, tailImplementation, [...callPath, args])) as NestingMock;
  root.callPath = callPath;
  return root;
};

export const fnNested = (depth = 2, tailImplementation?: (...args: any[]) => any): NestingMock =>
  fnNestedInternal(depth, tailImplementation);
