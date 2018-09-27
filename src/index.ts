import Router from 'koa-router';
import Utils from './utils';

export default class Decorator {
  private router: any;
  private controller: any;

  constructor(options: any) {
    const {router, controller} = options;
    if (!controller) {
      throw new Utils.Error.ConfigError('There is no configuration properties "controller"');
    }
    this.router = router || new Router();
    this.controller = controller;
  }

  create() {
    this.addRoutes();
    return this.router.routes();
  }

  addRoutes() {

  }

}
