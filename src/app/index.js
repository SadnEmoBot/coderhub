const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const useRoutes = require('../router/index')

const errorHandler = require('./error-handle')

const app = new Koa();


app.use(bodyParser()); //解析json

useRoutes(app);

app.on('error', errorHandler)

module.exports = app;