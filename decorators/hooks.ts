export const beforeSymbolKey = Symbol.for('before');
export const afterSymbolKey  = Symbol.for('after');


const createDecorator = (symbolKey: symbol) => {
  return (hookFunc: Function) => {
    return (target: Object, propertyKey: string) => {
      Reflect.defineMetadata(symbolKey, hookFunc, target, propertyKey);
    };
  };
};

export const Before = createDecorator(beforeSymbolKey);
export const After  = createDecorator(afterSymbolKey);
