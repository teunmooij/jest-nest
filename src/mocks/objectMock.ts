import type { Key, ObjectMockState, ObjectMock } from './objectMock.types';

const shouldRelayToContext = (name: Key): name is keyof jest.Mock =>
  typeof name === 'string' && ['mock', '_isMockFunction', 'mockName', 'getMockName'].includes(name);

const addRegistration =
  (target: ObjectMockState, valueFactory: (value: any) => any) =>
  (...args: any[]) => {
    const path = args.slice(0, -1);
    const value = valueFactory(args[args.length - 1]);

    target.registrations.push({ path, value });

    return target.self;
  };

const setStrictness = (target: ObjectMockState, strictness: boolean) => () => {
  target.strict = strictness;
  return target.self;
};

const objNestedInternal = <Shape extends Record<string, unknown>, Strict extends boolean>({
  callPath = [],
  registrations = [],
  strict,
}: {
  callPath?: ObjectMockState['callPath'];
  registrations?: ObjectMockState['registrations'];
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
          return addRegistration(target, func => func);
        case 'mockReturnValueAt':
          return addRegistration(target, value => () => value);
        case 'mockResolvedValueAt':
          return addRegistration(target, value => () => Promise.resolve(value));
        case 'mockRejectedValueAt':
          return addRegistration(target, value => () => Promise.reject(value));
        case 'mockGetValueAt':
          return addRegistration(target, value => value);
        case 'mockStrict':
          return setStrictness(target, true);
        case 'mockImplicit':
          return setStrictness(target, false);
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
