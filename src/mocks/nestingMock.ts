/**
 * jest Mock for nested functions
 */
export type NestingMock = jest.Mock & {
  /**
   * List of consecutive call arguments to this nested mock
   * @readonly
   */
  readonly callPath: ReadonlyArray<ReadonlyArray<any>>;
};

const fnNestedInternal = (
  depth: number,
  tailImplementation?: (this: NestingMock, ...args: any[]) => any,
  callPath: any[][] = [],
): NestingMock => {
  if (depth < 1 || depth % 1 !== 0) throw new Error('Depth must be a whole number greater than 0.');

  if (depth === 1) {
    const tail = jest.fn() as NestingMock;
    Object.defineProperty(tail, 'callPath', { get: () => callPath });
    tail.mockImplementation(tailImplementation?.bind(tail));
    return tail;
  }

  const root = jest.fn((...args) => fnNestedInternal(depth - 1, tailImplementation, [...callPath, args])) as NestingMock;
  Object.defineProperty(root, 'callPath', { get: () => callPath });
  return root;
};

/**
 * Creates a jest mock for a nested function
 * @param {number} [depth=2] depth of nesting
 * @param {(...args: any[]) => any} [tailImplementation] Implementation for the deepest nested function
 * @returns {NestingMock} the mock
 */
export const fnNested = (depth = 2, tailImplementation?: (this: NestingMock, ...args: any[]) => any): NestingMock =>
  fnNestedInternal(depth, tailImplementation);
