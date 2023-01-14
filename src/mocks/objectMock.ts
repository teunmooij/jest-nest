import { NestingMock } from './nestingMock';

export type ObjectMock = NestingMock & { [k: string | number | symbol]: jest.Mock<ObjectMock> };

const objNestedInternal = (callPath: any[][] = []) => {
  const state = {
    context: jest.fn(),
    callPath,
  };

  return new Proxy(state, {
    get(target, name): any {
      if (name === 'mock') return target.context.mock;
      if (name === 'callPath') return target.callPath;
      if (name === '_isMockFunction') return true;
      return jest.fn((...args) => {
        const objectArgs = [name, ...args];
        target.context.mockReturnValueOnce(objNestedInternal([...target.callPath, objectArgs]));
        return target.context(...objectArgs);
      });
    },
  }) as unknown as ObjectMock;
};

export const objNested = () => objNestedInternal();
