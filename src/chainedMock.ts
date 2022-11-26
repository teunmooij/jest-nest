type ChainedMock = jest.Mock & {
  next?: ChainedMock;
  callPath: any[][];
};

export const fnCurried = (
  depth = 2,
  tailImplementation?: (...args: any[]) => any,
  callPath: any[][] = [],
): ChainedMock => {
  if (depth < 1) throw new Error('depth must be a whole number greater then 0');

  if (depth === 1) {
    const tail = jest.fn(tailImplementation) as ChainedMock;
    tail.callPath = callPath;
    return tail;
  }

  const root = jest.fn((...args) => fnCurried(depth - 1, tailImplementation, [...callPath, args])) as ChainedMock;
  root.callPath = callPath;
  return root;
};
