const {
    saveAvatar, saveMomentPic
} = require('../service/upload.service');
const {
    updateAvatarUrlById
} = require('../service/user.service');

const { APP_HOST, APP_PORT } = require('../app/config');

class UploadController {
    async uploadAvatar(ctx, next) {
        // 1. 获取头像信息
        const { mimetype, filename, size } = ctx.req.file;
        const { id } = ctx.user;
        // 2. 保存头像信息到数据库中
        const result = saveAvatar(filename, mimetype, size, id);

        //3. 将图片地址保存到user表中
        // const avatarUrl = `./upload/avatar/${filename}`;
        const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
        await updateAvatarUrlById(avatarUrl, id);

        // ctx.body = result;
        ctx.body = "上传头像成功";
    }

    async uploadMomentPic(ctx, next) {
        // 1. 获取配图信息
        const files = ctx.req.files;
        const { id } = ctx.user;
        const { momentId } = ctx.query;
        // 2. 保存所有配图信息到数据库中
        for (let file of files) {
            const { mimetype, filename, size } = file;
            await saveMomentPic(filename, mimetype, size, id, momentId);
        }

        // ctx.body = result;
        ctx.body = "配图上传成功";
    }
}

module.exports = new UploadController();