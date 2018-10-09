export const httpMethodSymbolKey = Symbol.for('httpMethod');

const [Get, Post, Put, Delete, All] = ['get', 'post', 'put', 'deletc', 'all'].map((method) => {
  return (target: Object, propertyKey: string) => {
    Reflect.defineMetadata(httpMethodSymbolKey, method, target, propertyKey);
  };
});

export { Get, Post, Put, Delete, All };
