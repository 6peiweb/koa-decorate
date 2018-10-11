"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beforeSymbolKey = Symbol.for('before');
exports.afterSymbolKey = Symbol.for('after');
const createDecorator = (symbolKey) => {
    return (hookFunc) => {
        return (target, propertyKey) => {
            Reflect.defineMetadata(symbolKey, hookFunc, target, propertyKey);
        };
    };
};
exports.Before = createDecorator(exports.beforeSymbolKey);
exports.After = createDecorator(exports.afterSymbolKey);
