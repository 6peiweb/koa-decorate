"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpMethodSymbolKey = Symbol.for('httpMethod');
const [Get, Post, Put, Delete, All] = ['get', 'post', 'put', 'deletc', 'all'].map((method) => {
    return (target, propertyKey) => {
        Reflect.defineMetadata(exports.httpMethodSymbolKey, method, target, propertyKey);
    };
});
exports.Get = Get;
exports.Post = Post;
exports.Put = Put;
exports.Delete = Delete;
exports.All = All;
