import 'reflect-metadata';
import Router from 'koa-router';

import Utils from './utils';
import { Path } from './decorators/path';
import { Get, Post, Put, Delete, All } from './decorators/http-method';
import { Param, Query, Body, Ctx, Next } from './decorators/param';
import { Before, After} from './decorators/hooks';
import { httpMethodSymbolKey } from './decorators/http-method';
import { rootPathSymbolKey, routeSymbolKey, pathSymbolKey} from './decorators/path';

export default class Decorator {
  private router: Router;
  private controllers: Object;

  constructor(options) {
    const {router, controllers} = options;
    if (!controllers) {
      throw new Utils.Error.ConfigError('There is no configuration properties "controllers"');
    }
    this.router      = router || new Router();
    this.controllers = controllers;
  }

  create() {
    Utils.Type.objToArr(this.controllers).map(controller => this.addRoutes(controller));
    return this.router.routes();
  }

  addRoutes(Controller) {

    const instance     = new Controller();
    const rootPath     = Reflect.getMetadata(rootPathSymbolKey, Controller.prototype);
    const routes       = Reflect.getMetadata(routeSymbolKey, Controller.prototype);

    routes.map((routeName: string) => {
      const method     = instance[routeName];
      const httpMethod = Reflect.getMetadata(httpMethodSymbolKey, Controller.prototype, routeName);
      const path       = Reflect.getMetadata(pathSymbolKey, Controller.prototype, routeName);
      this.router[httpMethod](`${rootPath}${path}`, method(instance));
    })
  }

};

export { Path, Get, Post, Put, Delete, All, Param, Query, Body, Ctx, Next, Before, After };
