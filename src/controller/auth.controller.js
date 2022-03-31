const jwt = require('jsonwebtoken');
const { PRIVATE_KEY, PUBLIC_KEY } = require('../app/config')

class AuthController {
    async create(ctx, next) {
        const { id, name } = ctx.user; // 在auth.middleware.js里设置的
        const token = jwt.sign({ id, name }, PRIVATE_KEY, {
            expiresIn: 60 * 60 * 24,
            algorithm: 'RS256'
        });

        ctx.body = {
            id, name, token
        }
    }
    
    async success(ctx, next) {
        ctx.body = '授权成功';
    }
}

module.exports = new AuthController();