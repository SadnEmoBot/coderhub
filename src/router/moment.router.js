const Router = require('koa-router');

const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware');

const {
    create, momentDetail, momentList, momentUpdate, momentRemove, addLabels, picInfo
} = require('../controller/moment.controller')

const {
    verifyLabelExists
} = require('../middleware/label.middleware')

const momentRouter = new Router({
    prefix: '/moment'
});

momentRouter.post('/', verifyAuth, create);
momentRouter.get('/', momentList);
momentRouter.get('/:momentId', momentDetail);
// 1. verifyAuth -> 用户必须登录(授权) 2. verifyPermission -> 验证登录用户是否有具备权限去修改内容
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, momentUpdate);
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, momentRemove);

// 给动态添加标签
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabels);
// 给动态添加配图
momentRouter.get('/images/:filename', picInfo);

module.exports = momentRouter