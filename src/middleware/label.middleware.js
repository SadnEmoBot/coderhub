const {
    getLabelByName, create
} = require('../service/label.service');

const verifyLabelExists = async (ctx, next) => {
    // 1. 取出要添加的所有标签
    const labels = ctx.request.body.labels;
    // console.log(labels); [ '编程', '开发语言', 'C语言' ]

    // 2. 判断每一个标签在label表中是否存在
    const newLabels = [];
    for (let name of labels) {
        const labelResult = await getLabelByName(name);
        const label = { name };
        if (!labelResult) {
            // 没查到就创建标签数据
            const result = await create(name);
            label.id = result.insertId;
        } else {
            label.id = labelResult.id;
        }
        newLabels.push(label);
    }

    ctx.labels = newLabels;

    await next();
}

module.exports = {
    verifyLabelExists
}