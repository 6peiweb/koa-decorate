export const paramSymbolKey = Symbol.for('param');
export const querySymbolKey = Symbol.for('query');
export const bodySymbolKey  = Symbol.for('body');
export const ctxSymbolKey   = Symbol.for('ctx');
export const nextSymbolKey  = Symbol.for('next');

const createDecorator = (symbolKey: symbol) => {
  return (argName: string): Function => {
    return (target: Object, propertyKey: string, argIndex: number) => {
      const args = Reflect.getMetadata(symbolKey, target, propertyKey) || {};
      args[argName] = argIndex;
      Reflect.defineMetadata(symbolKey, args, target, propertyKey);
    };
  };
};

export const Param = createDecorator(paramSymbolKey);
export const Query = createDecorator(querySymbolKey);
export const Body  = createDecorator(bodySymbolKey);
export const Ctx   = createDecorator(ctxSymbolKey);
export const Next  = createDecorator(nextSymbolKey);
