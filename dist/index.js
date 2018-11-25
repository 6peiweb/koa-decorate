"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const koa_router_1 = __importDefault(require("koa-router"));
const path_1 = require("./decorator/path");
exports.Path = path_1.Path;
const http_method_1 = require("./decorator/http-method");
exports.Get = http_method_1.Get;
exports.Post = http_method_1.Post;
exports.Put = http_method_1.Put;
exports.Delete = http_method_1.Delete;
exports.All = http_method_1.All;
const parameter_1 = require("./decorator/parameter");
exports.Param = parameter_1.Param;
exports.Query = parameter_1.Query;
exports.Body = parameter_1.Body;
exports.Ctx = parameter_1.Ctx;
exports.Next = parameter_1.Next;
const hook_1 = require("./decorator/hook");
exports.Before = hook_1.Before;
exports.After = hook_1.After;
const http_method_2 = require("./decorator/http-method");
const path_2 = require("./decorator/path");
class Decorator {
    constructor(options) {
        const { router, controllers } = options;
        if (!controllers) {
            throw new Error('There is no configuration properties "controllers"');
        }
        this.router = router || new koa_router_1.default();
        this.controllers = controllers;
    }
    routes() {
        Object.values(this.controllers).map(controller => this.addRoutes(controller));
        return this.router.routes();
    }
    addRoutes(Controller) {
        const instance = new Controller();
        const rootPath = Reflect.getMetadata(path_2.rootPathSymbolKey, Controller.prototype);
        const routes = Reflect.getMetadata(path_2.routeSymbolKey, Controller.prototype);
        routes.map((routeName) => {
            const method = instance[routeName];
            const httpMethod = Reflect.getMetadata(http_method_2.httpMethodSymbolKey, Controller.prototype, routeName);
            const path = Reflect.getMetadata(path_2.pathSymbolKey, Controller.prototype, routeName);
            this.router[httpMethod](`${rootPath}${path}`, method(instance));
        });
    }
}
exports.default = Decorator;
;
