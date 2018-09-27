import Koa from 'koa';
import Router from 'koa-router';
import Controller from './controller';
import Decorator from './src';

const app = new Koa();

const routes = new Decorator({
	router: new Router(),
	controllesr: Controller
}).create();

app.use(async (ctx, next) => {
	console.log(`Process ${ctx.request.method} ${ctx.request.url} ${ctx.request.path}`);
	let enterTime = + new Date();
	next();
	ctx.response.set('X-Response-Time', `${+ new Date() - enterTime}`);
});


app.use(routes);

app.use(async (ctx) => {
	ctx.body = ctx.request;
});

app.listen(1997);
