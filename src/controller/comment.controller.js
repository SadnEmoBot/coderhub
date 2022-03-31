const {
    create, reply, update, remove, getCommentListById
} = require('../service/comment.service')

class CommentController {
    async create(ctx, next) {
        const { momentId, content } = ctx.request.body;
        const id = ctx.user.id;

         // 2. 将数据插入到数据库
         const result = await create(momentId, content, id);

         // 3. 返回数据
         ctx.body = result;
    }

    async reply(ctx, next) {
        const { momentId, content } = ctx.request.body;
        const id = ctx.user.id;
        const commentId = ctx.params.commentId;

         // 2. 将数据插入到数据库
         const result = await reply(momentId, content, commentId, id);

         // 3. 返回数据
         ctx.body = result;
    }

    async update(ctx, next) {
        const { content } = ctx.request.body;
        const commentId = ctx.params.commentId;

        const result = await update(content, commentId);

        ctx.body = result;
    }

    async remove(ctx, next) {
        const commentId = ctx.params.commentId;

        const result = await remove(commentId);

        ctx.body = result;
    }
    
    async list(ctx, next) {
        const momentId = ctx.query.momentId;

        const result = await getCommentListById(momentId);

        ctx.body = result;
    }
}

module.exports = new CommentController();