const errorType = require('../constants/error-types')

const errorHandler = (error, ctx) => {
    let status, message;
    switch (error.message) {
        case errorType.NAME_OR_PASSWORD_IS_REQUIRED:
            status = 400; // bad request 参数错误
            message = "用户名或者密码不能为空";
            break;
        case errorType.USER_ALREADY_EXISTS:
            status = 409; // conflict
            message = "用户名已存在";
            break;
        case errorType.USER_DOES_NOT_EXISTS:
            status = 400; // bad request
            message = "用户名不存在";
            break;
        case errorType.PASSWORD_IS_INCORRECT:
            status = 400; // bad request
            message = "密码错误";
            break;
        case errorType.UNAUTHED:
            status = 401; // unauthorized
            message = "token无效";
            break;
        case errorType.UNPERMISSION:
            status = 401; // unauthorized
            message = "您不具备操作权限";
            break;
        default:
            status = 404; 
            message = "NOT FOUND";
    }

    ctx.status = status;
    ctx.body = message;
}

module.exports = errorHandler;