const Router = require('koa-router');

const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware');

const {
    create, reply, update, remove, list
} = require('../controller/comment.controller')

const commentRouter = new Router({
    prefix: '/comment'
});
// 对动态发表评论
commentRouter.post('/', verifyAuth, create);
// 对某一条评论做回复
commentRouter.post('/:commentId/reply', verifyAuth, reply);
// // 1. verifyAuth -> 用户必须登录(授权) 2. verifyPermission -> 验证登录用户是否有具备权限去修改内容
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update);
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove);

commentRouter.get('/', list);

module.exports = commentRouter