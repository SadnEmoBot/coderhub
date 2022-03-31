const Router = require('koa-router');

const {
    create, getAvatarInfo
} = require('../controller/user.controller')

const {
    verifyUser, handlePassword
} = require('../middleware/user.middleware')

const userRouter = new Router({
    prefix: '/users'
});

userRouter.post('/', verifyUser, handlePassword, create)

//获取用户头像信息
userRouter.get('/:userId/avatar', getAvatarInfo)

module.exports = userRouter