# koa-decorate

[![npm](https://img.shields.io/npm/v/koa-decorate.svg)][npm-url]
[![downloads](https://img.shields.io/npm/dt/koa-decorate.svg)][npm-url]
[![Travis](https://travis-ci.org/6peiweb/koa-decorate.svg?branch=master)][travis-url]
[![License](https://img.shields.io/npm/l/koa-decorate.svg)](LICENSE)

[npm-url]: https://npmjs.org/package/koa-decorate
[travis-url]: https://travis-ci.org/6peiweb/koa-decorate
[es7-decorator-url]: https://github.com/wycats/javascript-decorators
[ts-node-url]: https://github.com/TypeStrong/ts-node

> Provides decorators for router middleware of [koa](https://github.com/koajs/koa).

## Install

[![NPM](https://nodei.co/npm/koa-decorate.png?downloads=true)](https://nodei.co/npm/koa-decorate/)

## Config
> Koa-decorate is based on the decorator provided by [es7][es7-decorator-url], but nodejs does not support the decorator temporarily. so we need to use typescript to develop our application, we can run our typescript directly through [ts-node][ts-node-url] without offline compiling.
```sh
npm install --save-dev ts-node nodemon
```
*nodemon.json*
```json
{
  "restartable": "rs",
  "ignore": [
    ".git",
    "node_modules"
  ],
  "verbose": true,
  "execMap": {
    "ts": "ts-node"
  },
  "watch": [
    "controller",
    "app.ts"
  ],
  "ext": "ts"
}
```

## Usage
```ts
// ts
import Koa from 'koa';
import Router from 'koa-router';
import Decorator from 'koa-decorate';

import Controller from './controller'; // 路由控制器类

const routes = new Decorator({
  router: new Router(),
  controllers: Controller
}).create();

app.use(routes);
```

## Licences

[MIT](LICENSE)