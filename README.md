# koa-decorate

[![npm](https://img.shields.io/npm/v/koa-decorate.svg)][npm-url]
[![downloads](https://img.shields.io/npm/dt/koa-decorate.svg)][npm-url]
[![Travis](https://travis-ci.org/6peiweb/koa-decorate.svg?branch=master)][travis-url]
[![License](https://img.shields.io/npm/l/koa-decorate.svg)](LICENSE)

[npm-url]: https://npmjs.org/package/koa-decorate
[travis-url]: https://travis-ci.org/6peiweb/koa-decorate
[es7-decorator-url]: https://github.com/wycats/javascript-decorators
[ts-node-url]: https://github.com/TypeStrong/ts-node

> 为 [koa-router](https://github.com/ZijianHe/koa-router) 提供装饰器。

## 安装

[![NPM](https://nodei.co/npm/koa-decorate.png?downloads=true)](https://nodei.co/npm/koa-decorate/)

## 应用配置
> Koa-decorate 基于 [es7][es7-decorator-url] 提供的装饰器， 
但是 NodeJs 暂时不支持装饰器语法糖。
所以我们需要使用 TypeScript 开发我们的应用, 
我们可以通过 [ts-node][ts-node-url] 直接运行 TypeScript，无需通过线下先编译。
```sh
npm install --save-dev ts-node nodemon
```
*配置 nodemon.json (使用详情请查看[koa-app](https://github.com/6peiweb/koa-app)) *
```json
{
  "restartable": "rs",
  "verbose": true,
  "execMap": {
	"ts": "ts-node",
	"js": "node"
  },
  "watch": [
    "src"
  ],
  "ext": "ts"
}
```

## API 使用说明

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
**类别**： 工厂类
<a name="module_koa-router--Decorator_new"></a>

#### new Decorator([opts])
创建一个 koa-decorate 实例。

| 参数                | 类别                | 描述              |
| ---                | ---                 | ---              |
| [opts]             | <code>Object</code> |                  |
| [opts.router]      | <code>Object</code> | koa-router 实例   |
| [opts.controllers] | <code>Object</code> | 路由控制器类       |

<a name="module_koa-decorate--Decorator+routes"></a>

#### Decorator.routes ⇒ <code>function</code>
该方法用来装载控制器，并派发与请求想匹配的路由，返回一个 koa 中间件。

**类别**： <code>[Decorator](#module_koa-router--Decorator_new)</code> 的实例属性。 

**举例**  
基础用法:

```typescript
// app.ts
import Koa from 'koa';
import Router from 'koa-router';
import Decorator from 'koa-decorate';

import Controller from './controller'; // 路由控制器类

const router = new Decorator({
    router: new Router(),
  	controllers: Controller
});

app.use(router.routes());
```
<a name="module_koa-decorate--Http_method"></a>

#### http-method ⇒ <code>@Get|@Post|@Put|@Delete|@All</code>
创建 `@Verb` 方法来匹配 HTTP 方法，*Verb* 是 HTTP 动词中的一个，像 `@Get` or `@Post` 等。

另外, `@All` 可以与所有的 HTTP 方法相匹配。

**举例**  

```typescript
// CatController.ts
import { Path, Get, Post } from 'koa-decorate';

@Path('/api/cat')
class CatController {

  	@Get
  	@Path('/info')
  	async getCatInfo () {
    	return await new Promise(resolve => {
			setTimeout(() => resolve({
				id: 1,
				name: 'Lina Weiss',
				type: 'Norwegian Forest Cat',
			}), 1000);
    	})
  }

	@Post
	@Path('/info/')
	async CreateCat () {
		return {
			status: 200,
			data: {
				id: 2
			},
			message: 'Created successfully...',
		};
	}

}

export { CatController };
```
<a name="module_koa-decorate--Path"></a>

#### path ⇒ <code>@Path</code>
将 URL 与回调函数或控制器相匹配使用 `@Path`，当 `authFunc` 返回 *true* ，控制器可以执行逻辑操作，否则拒绝访问。

| 参数        | 类别                             | 描述               |
| ---        | ---                              | ---               |
| path       | <code>String</code>              |                   |
| [authFunc] | <code>Function => Boolean</code> | 验证回调函数，非必须 |

**举例**  

```typescript
// CatController.ts
import { Path, Get } from 'koa-decorate';

@Path('/api/cat')
class CatController {

  	@Get
  	@Path('/info/:id', (ctx) => Number(ctx.params.id) === 1)
  	async getCatInfo () {
    	return {
      		id: 1,
      		name: 'Lina Weiss',
      		type: 'Norwegian Forest Cat'
    	};
	}
}

export { CatController };
```
<a name="module_koa-decorate--Parameter"></a>

#### parameter ⇒ <code>@Param|@Query|@Body|@Ctx|@Next</code>
`@Parameter` 类型的装饰器用来修饰 URL 中的参数或 koa 回调路由回调中的参数，*Parameter* 可以是 `@Param`、 `@Query`、 `@Body`、 `@Ctx`、 `@Next` 中的一个。（函数形参修饰器只有 *TypeScript* 支持）

| 参数        | 类别                |描述       |
| ---        | ---                 | ---      |
| name       | <code>String</code> |          |

**举例**  

```typescript
// CatController.ts
import { Path, Get, Post, Param, Query, Body, Ctx } from 'koa-decorate';

@Path('/api/cat')
class CatController {

  	@Get
  	@Path('/info/:type')
  	async getCatInfo (@Param('type') type: string,
				@Query('info') info: string,
	) {
    	return { type, info };
  	}

  	@Post
  	@Path('/info/:type')
  	async CreateCat (@Param('type') type: string,
				 @Body('requestBody') requestBody: any,
	) {
    	return {
      		status: 200,
      		data: Object.assign(requestBody, { type }),
      		message: 'Created successfully...',
    	};
  	}

}

export { CatController };
```
<a name="module_koa-decorate--Hook"></a>

#### hook ⇒ <code>@Before|@After</code>
当 URL 与路由匹配正确后，在执行控制器逻辑前会先执行 `@Before`的 *hookFunc* ，处理完控制器逻辑后会执行 `@After` 的 *hookFunc*。

| 参数       | 类别                   | 描         |
| ---        | ---                   | ---       |
| [hookFunc] | <code>Function</code> | 回调钩子   |

**举例**  

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
	async getCatInfo (@Param('type') type: string,
				  @Query('info') info: string,
	) {
    	return { type, info };
  	}
}

export { CatController };
```

<a name="module_koa-router--Controller"></a>

### Controller
**Kind**: 导出一个路由控制器集合的 *HashMap* 。

**Example**  

```typescript
// Controller/index.ts
import { CatController } from './cat';

export default {
  Cat: CatController
};

```


## 示例

[koa-app](https://github.com/6peiweb/koa-app)

## Licences

[MIT](LICENSE)
