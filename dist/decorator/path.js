"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const param_1 = require("./param");
const hook_1 = require("./hook");
exports.rootPathSymbolKey = Symbol.for('rootPath');
exports.rootAuthSymbolKey = Symbol.for('rootAuth');
exports.routeSymbolKey = Symbol.for('route');
exports.pathSymbolKey = Symbol.for('path');
exports.Path = (path, authFunc) => {
    return (target, propertyKey, decorator) => {
        if (propertyKey === undefined && decorator === undefined) {
            Reflect.defineMetadata(exports.rootPathSymbolKey, path, target.prototype);
            Reflect.defineMetadata(exports.rootAuthSymbolKey, authFunc, target.prototype);
        }
        else {
            const routeMethods = Reflect.getMetadata(exports.routeSymbolKey, target) || [];
            routeMethods.push(propertyKey);
            Reflect.defineMetadata(exports.routeSymbolKey, routeMethods, target);
            Reflect.defineMetadata(exports.pathSymbolKey, path, target, propertyKey);
            const oldMethodValue = decorator.value;
            decorator.value = (instance) => (ctx, next) => __awaiter(this, void 0, void 0, function* () {
                const rootAuth = Reflect.getMetadata(exports.rootAuthSymbolKey, target);
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
                const param = Reflect.getMetadata(param_1.paramSymbolKey, target, propertyKey);
                param && Object.keys(param).map(key => args[param[key]] = ctx.params[key]);
                const query = Reflect.getMetadata(param_1.querySymbolKey, target, propertyKey);
                query && Object.keys(query).map(key => args[query[key]] = ctx.query);
                const body = Reflect.getMetadata(param_1.bodySymbolKey, target, propertyKey);
                body && Object.keys(body).map(key => args[body[key]] = ctx.request.body);
                const ctx1 = Reflect.getMetadata(param_1.ctxSymbolKey, target, propertyKey);
                ctx1 && Object.keys(ctx1).map(key => args[ctx1[key]] = ctx);
                const next1 = Reflect.getMetadata(param_1.nextSymbolKey, target, propertyKey);
                next1 && Object.keys(next1).map(key => args[next1[key]] = next);
                const before = Reflect.getMetadata(hook_1.beforeSymbolKey, target, propertyKey);
                before && typeof before === 'function' && before(ctx, next);
                const result = yield oldMethodValue.apply(instance, args);
                const after = Reflect.getMetadata(hook_1.afterSymbolKey, target, propertyKey);
                after && typeof after === 'function' && after(ctx, next);
                ctx.body = result;
            });
        }
    };
};
