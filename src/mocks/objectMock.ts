import type { Path, Key, MockRegistration, ObjectMockState, ObjectMock } from './objectMock.types';

const shouldRelayToContext = (name: Key): name is keyof jest.Mock =>
  typeof name === 'string' && ['mock', '_isMockFunction', 'mockName', 'getMockName'].includes(name);

const objNestedInternal = <Shape extends Record<string, unknown>, Strict extends boolean>({
  callPath = [],
  registrations = [],
  strict,
}: {
  callPath?: any[][];
  registrations?: MockRegistration[];
  strict: Strict;
}) => {
  const state = {
    context: jest.fn(),
    registrations,
    callPath,
    strict,
  } as ObjectMockState;

  const proxy = new Proxy(state, {
    get(target, name): any {
      if (shouldRelayToContext(name)) return target.context[name];

      switch (name) {
        case 'callPath':
          return target.callPath;
        case 'mockImplementationAt':
          return <P extends Path, F extends (...args: any[]) => any>(path: P, value: F) => {
            target.registrations.push({ path, value });
            return target.self;
          };
        case 'mockReturnValueAt':
          return <P extends Path, V>(path: P, value: V) => {
            target.registrations.push({ path, value: () => value });
            return target.self;
          };
        case 'mockResolvedValueAt':
          return <P extends Path, V>(path: P, value: V) => {
            target.registrations.push({ path, value: () => Promise.resolve(value) });
            return target.self;
          };
        case 'mockRejectedValueAt':
          return <P extends Path, V>(path: P, value: V) => {
            target.registrations.push({ path, value: () => Promise.reject(value) });
            return target.self;
          };
        case 'mockGetValueAt':
          return <P extends Path, V>(path: P, value: V) => {
            target.registrations.push({ path, value });
            return target.self;
          };
        case 'mockStrict':
          return () => {
            target.strict = true;
            return target.self;
          };
        case 'mockImplicit':
          return () => {
            target.strict = false;
            return target.self;
          };
        case 'toJSON':
          return () => '[ObjectMock]'; // TODO: provide better value like 'ObjectMock as path mock.foo('bar').baz
        case 'toString':
          return () => '[ObjectMock]'; // TODO: provide better value like 'ObjectMock as path mock.foo('bar').baz
        case 'calls':
        case Symbol.toPrimitive:
          return null;
      }

      const matchingRegistration = target.registrations.find(
        registration => registration.path.length === 1 && registration.path[0] === name,
      );

      if (matchingRegistration) {
        if (typeof matchingRegistration.value === 'function') {
          return jest.fn((...args) => {
            const objectArgs = [name, ...args];
            const implementationContext = { callPath: target.callPath };
            target.context.mockImplementationOnce((_, ...args) =>
              matchingRegistration.value.bind(implementationContext)(...args),
            );
            return target.context(...objectArgs);
          });
        }

        target.context(name);
        return matchingRegistration.value;
      }

      const tailRegistrations = target.registrations
        .filter(registration => registration.path[0] === name)
        .map(({ path: [, ...tail], value }) => ({ path: tail, value }));

      if (target.strict && !tailRegistrations.length) return undefined;

      return jest.fn((...args) => {
        const objectArgs = [name, ...args];
        target.context.mockReturnValueOnce(
          objNestedInternal({
            callPath: [...target.callPath, objectArgs],
            registrations: tailRegistrations,
            strict: target.strict,
          }),
        );
        return target.context(...objectArgs);
      });
    },
  }) as unknown as ObjectMock<Shape, Strict>;

  state.self = proxy;

  return proxy;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const objNested = () => objNestedInternal<{}, false>({ strict: false });
