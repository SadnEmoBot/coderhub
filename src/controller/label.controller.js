const { create, getLabelList } = require('../service/label.service.js');

class LabelController {
    async create(ctx, next) {
        const name = ctx.request.body.name;
        const result = await create(name);
        ctx.body = result;
    }

    async list(ctx, next) {
        const { offset, size } = ctx.query;
        const result = await getLabelList(offset, size);
        ctx.body = result;
    }
}

module.exports = new LabelController();