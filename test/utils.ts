export const expectTypes = <TActual, TExpected>() =>
  ({
    toBeIdentical: true,
  } as unknown as [TActual] extends [TExpected] ? ([TExpected] extends [TActual] ? { toBeIdentical: true } : never) : never);
