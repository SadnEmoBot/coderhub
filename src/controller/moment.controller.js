const fs = require('fs');

const {
    create, getMomentById, getMomentList, updateById, removeById, hasLabel, addLabel
} = require('../service/moment.service');

const { getPicByFilename } = require('../service/upload.service');

class MomentController {
    async create(ctx, next) {
        // 1. 获取数据(user_id -> 要知道是谁发表的动态, content)
        const userId = ctx.user.id; // 在登陆验证token时存了 auth.middleware.js里
        const content = ctx.request.body.content;

        // 2. 将数据插入到数据库
        const result = await create(userId, content);

        // 3. 返回数据
        ctx.body = result;
    }

    // 获取某条动态的接口
    async momentDetail(ctx, next) {
        // 1. 获取数据(momentId) url/moment/1
        const momentId = ctx.params.momentId;

        // 2. 根据id去查询这条数据
        const result = await getMomentById(momentId);

        // 3. 返回数据
        ctx.body = result;
    }

    // 获取全部动态的接口
    async momentList(ctx, next) {
        // 1. 获取数据(offset, size) url/moment?offset=0&size=10
        const { offset, size } = ctx.query;

        // 2. 查询动态列表
        const result = await getMomentList(offset, size);

        // 3. 返回数据
        ctx.body = result;
    }

    async momentUpdate(ctx, next) {
        // 1. 获取数据(momentId) url/moment/1
        const momentId = ctx.params.momentId;
        // 从请求体中获取content
        const content = ctx.request.body.content;

        // 2. 根据条件去查询这条数据
        const result = await updateById(content, momentId);

        // 3. 返回数据
        ctx.body = result;
    }

    async momentRemove(ctx, next) {
        // 1. 获取数据(momentId) url/moment/1
        const momentId = ctx.params.momentId;

        // 2. 根据条件去删除这条数据
        const result = await removeById(momentId);

        // 3. 返回数据
        ctx.body = result;
    }

    async addLabels(ctx, next) {
        // 1. 获取数据(labels 为数组 [])
        const labels = ctx.labels; // verifyLabelExists里存的
        const momentId = ctx.params.momentId;
        console.log(labels);
        // 2. 添加所有标签
        for (let label of labels) {
            // 2.1 判断标签是否已经有过关系
            const isExists = await hasLabel(momentId, label.id);
            if (!isExists) {
                await addLabel(momentId, label.id);
            }
        }

        // 3. 返回数据
        ctx.body = '添加成功';
    }

    async picInfo(ctx, next) {
        let { filename } = ctx.params;
        const picInfo = await getPicByFilename(filename);
        const { type } = ctx.query;
        const types = ["small", "middle", "large"];
        if (types.some(item => item === type)) {
            filename = filename + '-' + type;
        }
        ctx.response.set('content-type', picInfo.mimetype);
        ctx.body = fs.createReadStream(`./upload/pic/${filename}`);
    }
}
module.exports = new MomentController();