const Router = require('koa-router');

const { verifyAuth } = require('../middleware/auth.middleware');
const { avatarHandler, picArrHandler, picResize } = require('../middleware/upload.middleware');
const {
    uploadAvatar, uploadMomentPic
} = require('../controller/upload.controller.js')

const uploadRouter = new Router({
    prefix: '/upload'
});
// 上传头像
uploadRouter.post('/avatar', verifyAuth, avatarHandler, uploadAvatar);
// 上传动态配图
uploadRouter.post('/pic', verifyAuth, picArrHandler, picResize, uploadMomentPic);

module.exports = uploadRouter;