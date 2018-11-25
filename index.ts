import 'reflect-metadata';
import Router from 'koa-router';

import { Path } from './decorator/path';
import { Get, Post, Put, Delete, All } from './decorator/http-method';
import { Param, Query, Body, Ctx, Next } from './decorator/parameter';
import { Before, After} from './decorator/hook';
import { httpMethodSymbolKey } from './decorator/http-method';
import { rootPathSymbolKey, routeSymbolKey, pathSymbolKey} from './decorator/path';

export default class Decorator {
  private router: Router;
  private controllers: Object;

  constructor (options) {
    const {router, controllers} = options;
    if (!controllers) {
      throw new Error('There is no configuration properties "controllers"');
    }
    this.router      = router || new Router();
    this.controllers = controllers;
  }

  public routes () {
    (<any>Object).values(this.controllers).map(controller => this.addRoutes(controller));
    return this.router.routes();
  }

  private addRoutes (Controller) {

    const instance     = new Controller();
    const rootPath     = Reflect.getMetadata(rootPathSymbolKey, Controller.prototype);
    const routes       = Reflect.getMetadata(routeSymbolKey, Controller.prototype);

    routes.map((routeName: string) => {
      const method     = instance[routeName];
      const httpMethod = Reflect.getMetadata(httpMethodSymbolKey, Controller.prototype, routeName);
      const path       = Reflect.getMetadata(pathSymbolKey, Controller.prototype, routeName);
      this.router[httpMethod](`${rootPath}${path}`, method(instance));
    });
  }

};

export { Path, Get, Post, Put, Delete, All, Param, Query, Body, Ctx, Next, Before, After };
