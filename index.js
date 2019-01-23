const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
const http2 = require('http2');
const views = require('koa-views');
const serve = require('koa-static');
const convert = require('koa-convert');
const serverpush = require('./lib/server-push')

const app = new Koa();
const router = new Router();

app.use(views(path.join(__dirname, '/views'), {
}));

app.use(serverpush());
app.use(router.routes());
app.use(convert(serve('./static')));

/**
 * App Routes
 */
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    push: 'push'
  });
});

const options = {
  key: fs.readFileSync('./secure/server.key'),
  cert: fs.readFileSync('./secure/server.crt')
}

http2.createSecureServer(options, app.callback()).listen(3000);
console.log(`Server started at port ${3000}`);
