"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramSymbolKey = Symbol.for('param');
exports.querySymbolKey = Symbol.for('query');
exports.bodySymbolKey = Symbol.for('body');
exports.ctxSymbolKey = Symbol.for('ctx');
exports.nextSymbolKey = Symbol.for('next');
const createDecorator = (symbolKey) => {
    return (argName) => {
        return (target, propertyKey, argIndex) => {
            const args = Reflect.getMetadata(symbolKey, target, propertyKey) || {};
            args[argName] = argIndex;
            Reflect.defineMetadata(symbolKey, args, target, propertyKey);
        };
    };
};
exports.Param = createDecorator(exports.paramSymbolKey);
exports.Query = createDecorator(exports.querySymbolKey);
exports.Body = createDecorator(exports.bodySymbolKey);
exports.Ctx = createDecorator(exports.ctxSymbolKey);
exports.Next = createDecorator(exports.nextSymbolKey);
