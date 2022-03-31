const Router = require('koa-router');

const {
    create, success
} = require('../controller/auth.controller');

const {
    verifyLogin, verifyAuth
} = require('../middleware/auth.middleware')

const authRouter = new Router();

authRouter.post('/login', verifyLogin, create);

// 验证登录授权
authRouter.get('/test', verifyAuth, success);

module.exports = authRouter;