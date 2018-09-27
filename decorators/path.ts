import { 
  paramSymbolKey,
  querySymbolKey,
  bodySymbolKey,
  ctxSymbolKey,
  nextSymbolKey
} from './param';

import { 
  beforeSymbolKey,
  afterSymbolKey 
} from './hooks';

export const rootPathSymbolKey    = Symbol.for('rootPath');
export const rootAuthSymbolKey    = Symbol.for('rootAuth');
export const routeSymbolKey       = Symbol.for('route');
export const pathSymbolKey        = Symbol.for('path');

export const Path = (path: string, authFunc?: Function): Function => {
  return (target: Object & Function, propertyKey: string, decorator: TypedPropertyDescriptor<Function>) => {
    if (propertyKey === undefined && decorator === undefined) {
      Reflect.defineMetadata(rootPathSymbolKey, path, target.prototype);
      Reflect.defineMetadata(rootAuthSymbolKey, authFunc, target.prototype);
    } else {
      const routeMethods =  Reflect.getMetadata(routeSymbolKey, target) || [];
      routeMethods.push(propertyKey);
      Reflect.defineMetadata(routeSymbolKey, routeMethods, target);
      Reflect.defineMetadata(pathSymbolKey, path, target, propertyKey);

      const oldMethodValue = decorator.value;
      decorator.value = (instance: Object) => async (ctx: any, next: any) => {
        const rootAuth = Reflect.getMetadata(rootAuthSymbolKey, target);
        if (rootAuth && typeof rootAuth === 'function') {
          let hasAuth = rootAuth(ctx, next);
          if (!hasAuth) {
            ctx.status = 403;
            ctx.body = 'forbidden';
            return;
          }
        }
        if (authFunc && typeof authFunc === 'function') {
          let hasAuth = authFunc(ctx, next);
          if (!hasAuth) {
            ctx.status = 403;
            ctx.body = 'forbidden';
            return;
          }
        }

        const args = [];
        const param  = Reflect.getMetadata(paramSymbolKey, target, propertyKey);
        param  && Object.keys(param).map(key => args[param[key]] = ctx.params[key]);

        const query  = Reflect.getMetadata(querySymbolKey, target, propertyKey);
        query  && Object.keys(query).map(key => args[query[key]] = ctx.query);

        const body   = Reflect.getMetadata(bodySymbolKey, target, propertyKey);
        body   && Object.keys(body).map(key  => args[body[key]]  = ctx.request.body);

        const ctx1   = Reflect.getMetadata(ctxSymbolKey, target, propertyKey);
        ctx1   && Object.keys(ctx1).map(key  => args[ctx1[key]]  = ctx);

        const next1  = Reflect.getMetadata(nextSymbolKey, target, propertyKey);
        next1  && Object.keys(next1).map(key => args[next1[key]] = next);

        const before = Reflect.getMetadata(beforeSymbolKey, target, propertyKey);
        before && typeof before === 'function' && before(ctx, next);

        const result = await oldMethodValue.apply(instance, args);

        const after  = Reflect.getMetadata(afterSymbolKey, target, propertyKey);
        after  && typeof after  === 'function' && after(ctx, next);

        ctx.body = result;
      };
    }
  };
};