const fs = require('fs');
const {
    create
} = require('../service/user.service')
const {
    getAvatarInfoById
} = require('../service/upload.service');

class UserController {
    async create(ctx, next) {
        // 1. 获取用户请求传递的参数
        const user = ctx.request.body;

        // 2. 查询数据库数据
        const result = await create(user);

        // 3. 返回数据
        ctx.body = result;
    }

    async getAvatarInfo(ctx, next) {
        // 1. 获取用户id  /users/6/avatar
        const { userId } = ctx.params;

        // 2. 查询数据库数据
        const result = await getAvatarInfoById(userId);

        // 3. 提供/返回图像信息
        ctx.response.set('content-type', result.mimetype);
        // 只写这一句 在浏览器访问时，浏览器会将该文件视为mp3等文件 就直接会下载。 若想打开浏览器只是查看该图片 需要设置content-type为image/jpeg
        ctx.body = fs.createReadStream(`./upload/avatar/${result.filename}`);
    }
}

module.exports = new UserController();