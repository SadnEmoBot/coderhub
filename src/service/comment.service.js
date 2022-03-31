const connection = require('../app/database');

class CommentService {
    async create(momentId, content, id) {
        const statement = `insert into comment (content, moment_id, user_id) values (?, ?, ?);`;

        const result = await connection.execute(statement, [content, momentId, id]);

        // 将user存储到数据库中
        return result[0];
    }

    async reply(momentId, content, commentId, id) {
        const statement = `insert into comment (content, moment_id, user_id, comment_id) values (?, ?, ?, ?);`;

        const result = await connection.execute(statement, [content, momentId, id, commentId]);

        // 将user存储到数据库中
        return result[0];
    }

    async update(content, commentId) {
        const statement = `UPDATE comment SET content = ? WHERE id = ?;`;

        const result = await connection.execute(statement, [content, commentId]);

        return result[0];
    }

    async remove(commentId) {
        const statement = `DELETE FROM comment WHERE id = ?;`;

        const result = await connection.execute(statement, [commentId]);

        return result[0];
    }

    async getCommentListById(momentId) {
        // const statement = `SELECT * FROM comment WHERE moment_id = ?;`;
        const statement = `select comment.id, comment.content, comment.comment_id as commentId, comment.createAt as createTime, comment.updateAt as updateTime, 
                                  JSON_OBJECT('id', user.id, 'name', user.name) as author
                            from comment
                            left join user on comment.user_id = user.id
                            where moment_id = ?;`;

        const result = await connection.execute(statement, [momentId]);

        return result[0];
    }
}

module.exports = new CommentService();