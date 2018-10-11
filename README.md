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
> Koa-decorate is based on the decorator provided by [es7][es7-decorator-url], 
but nodejs does not support the decorator temporarily. 
so we need to use typescript to develop our application, 
we can run our typescript directly through [ts-node][ts-node-url] without offline compiling.
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

## API Reference

* [koa-decorate](#module_koa-decorate)
    * [Decorator](#module_koa-decorate--Decorator) ⏏
        * [new Decorator([opts])](#module_koa-decorate--Decorator_new)
        * [.routes](#module_koa-decorate--Decorator+routes) ⇒ <code>function</code>
    * _decorator_
        * [http-method](#module_koa-decorate--Http_method) ⇒ <code>@Get|@Post|@Put|@Delete|@All</code>
        * [path](#module_koa-decorate--Path) ⇒ <code>@Path</code>
        * [parameter](#module_koa-decorate--Parameter) ⇒ <code>@Param|@Query|@Body|@Ctx|@Next</code>
        * [hook](#module_koa-decorate--Hook) ⇒ <code>@Before|@After</code>
    * [Controller](#module_koa-decorate--Controller)


<a name="module_koa-router--Decorator"></a>

### Decorator
**Kind**: Exported class
<a name="module_koa-router--Decorator_new"></a>

#### new Decorator([opts])
Create a new decorated router.

| Param              | Type                | Description              |
| ---                | ---                 | ---                      |
| [opts]             | <code>Object</code> |                          |
| [opts.router]      | <code>Object</code> | koa-router instance      |
| [opts.controllers] | <code>Object</code> | route controller classes |

<a name="module_koa-decorate--Decorator+routes"></a>

#### Decorator.routes ⇒ <code>function</code>
Returns router middleware which dispatches a route matching the request.

**Kind**: instance property of <code>[Decorator](#module_koa-router--Decorator_new)</code>  

**Example**  
Basic usage:

```typescript
// app.ts
import Koa from 'koa';
import Router from 'koa-router';
import Decorator from 'koa-decorate';

import Controller from './controller'; // Route controller classes

const routes = new Decorator({
  router: new Router(),
  controllers: Controller
}).routes();

app.use(routes);
```
<a name="module_koa-decorate--Http_method"></a>

#### http-method ⇒ <code>@Get|@Post|@Put|@Delete|@All</code>
Create `@Verb` methods to match against HTTP methods, where *Verb* is one of the HTTP verbs 
such as `@Get` or `@Post` etc.

Additionaly, `@All` can be used to match against all methods.

**Example**  

```typescript
// CatController.ts
import { Path, Get, Post } from 'koa-decorate';

@Path('/api/cat')
class CatController {

  @Get
  @Path('/info')
  getCatInfo () {
    return {
      id: 1,
      name: 'Lina Weiss',
      type: 'Norwegian Forest Cat'
    }
  }

  @Post
  @Path('/info/')
  CreateCat () {
    return {
      status: 200,
      data: {
        id: 2
      },
      message: 'Created successfully...'
    }
  }

}

export { CatController };
```
<a name="module_koa-decorate--Path"></a>

#### path ⇒ <code>@Path</code>
Match URL patterns to callback functions or controller actions using `@Path`,
when `authFunc` returns *true*, controller can execute logical actions, otherwise access denied. 

| Param      | Type                             | Description    |
| ---        | ---                              | ---            |
| path       | <code>String</code>              |                |
| [authFunc] | <code>Function => Boolean</code> | route callback |

**Example**  

```typescript
// CatController.ts
import { Path, Get } from 'koa-decorate';

@Path('/api/cat')
class CatController {

  @Get
  @Path('/info/:id', (ctx) => Number(ctx.params.id) === 1)
  getCatInfo () {
    return {
      id: 1,
      name: 'Lina Weiss',
      type: 'Norwegian Forest Cat'
    }
  }
}

export { CatController };
```
<a name="module_koa-decorate--Parameter"></a>

#### parameter ⇒ <code>@Param|@Query|@Body|@Ctx|@Next</code>
Create `@Parameter` decorators, where *Parameter* is one of the parameter-names such
as `@Param`, `@Query`, `@Body` etc.

| Param      | Type                | Description    |
| ---        | ---                 | ---            |
| name       | <code>String</code> |                |

**Example**  

```typescript
// CatController.ts
import { Path, Get, Post, Param, Query, Body, Ctx } from 'koa-decorate';

@Path('/api/cat')
class CatController {

  @Get
  @Path('/info/:type')
  getCatInfo (
      @Param('type') type: string,
      @Query('info') info: string) {
    return { type, info }
  }

  @Post
  @Path('/info/:type')
  CreateCat (
      @Param('type') type: string,
      @Body('requestBody') requestBody: any) {
    return {
      status: 200,
      data: Object.assign(requestBody, { type }),
      message: 'Created successfully...'
    }
  }

}

export { CatController };
```
<a name="module_koa-decorate--Hook"></a>

#### hook ⇒ <code>@Before|@After</code>
When the routing match is correct, the *hookFunc* is used to deal with 
the transactions `@Before` and `@After` processing.

| Param      | Type                  | Description    |
| ---        | ---                   | ---            |
| [hookFunc] | <code>Function</code> | callback hook  |

**Example**  

```typescript
// CatController.ts
import { Path, Get, Param, Query, Before, After } from 'koa-decorate';

@Path('/api/cat')
class CatController {

  @Get
  @Path('/info/:type')
  @Before((ctx, next) => {
    // ...
  })
  @After((ctx, next) => {
    // ...
  })
  getCatInfo (
      @Param('type') type: string,
      @Query('info') info: string) {
    return { type, info }
  }

}

export { CatController };
```

<a name="module_koa-router--Controller"></a>

### Controller
**Kind**: The dictionary of route controller classes

**Example**  

```typescript
// Controller/index.ts
import { CatController } from './cat';

export default {
  Cat: CatController
};

```

## Licences

[MIT](LICENSE)