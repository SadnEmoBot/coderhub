const jwt = require('jsonwebtoken');

const errorType = require('../constants/error-types')
const { getUserByName } = require('../service/user.service')
const { checkAuth } = require('../service/auth.service')
const md5password = require('../utils/handle-password')

const { PUBLIC_KEY } = require('../app/config')

const verifyLogin = async (ctx, next) => {
    // 1. 获取用户名和密码
    const { name, password } = ctx.request.body;

    //2. 判断用户名或密码不能为空
    if (!name || !password) {
        const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit('error', error, ctx);
    }

    //3. 判断用户是否存在
    const result = await getUserByName(name);
    const user = result[0]
    if (!user) {
        const error = new Error(errorType.USER_DOES_NOT_EXISTS);
        return ctx.app.emit('error', error, ctx);
    }

    //4. 判断密码是否和数据库中的密码一致(加密)
    if (md5password(password) !== user.password) {
        const error = new Error(errorType.PASSWORD_IS_INCORRECT);
        return ctx.app.emit('error', error, ctx);
    }

    ctx.user = user;

    await next();
}

const verifyAuth = async (ctx, next) => {
    // 1. 获取token
    const authorization = ctx.headers.authorization;
    if (!authorization) {
        const error = new Error(errorType.UNAUTHED);
        ctx.app.emit('error', error, ctx);
    }
    const token = authorization.replace('Bearer ', '');

    // 2. 验证token
    try {
        const result = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ["RS256"]
        });
        ctx.user = result;
        await next();
    } catch (err) {
        const error = new Error(errorType.UNAUTHED);
        ctx.app.emit('error', error, ctx);
    }
}

/**
 * 因为只要涉及到修改 / 删除的时候都需要验证权限
 * 一对一: user -> role
 * 多对多: role - menu(删除/修改)
 */
const verifyPermission = async (ctx, next) => {
    // 1. 获取参数 (momentId -> /moment/1,  id -> 在auth验证时存了)
    // console.log(ctx.params); -> { momentId: 1 }
    const [paramsKey] = Object.keys(ctx.params); // 'momentId'
    const paramsId = ctx.params[paramsKey]; // 1
    const tableName = paramsKey.replace('Id', ''); // moment

    const id = ctx.user.id
    // 2. 查询是否具有权限
    try {
        const permission = await checkAuth(tableName, paramsId, id);
        if (!permission) {
            const error = new Error(errorType.UNPERMISSION);
            return ctx.app.emit('error', error, ctx);
        }
        await next();
    } catch (err) {
        const error = new Error(errorType.UNPERMISSION);
        return ctx.app.emit('error', error, ctx);
    }
}

module.exports = {
    verifyLogin, verifyAuth, verifyPermission
}