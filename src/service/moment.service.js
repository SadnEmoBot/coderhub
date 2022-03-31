const connection = require('../app/database');

class MomentService {
    async create(userId, content) {
        const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?);`;

        const result = await connection.execute(statement, [content, userId]);

        // 将user存储到数据库中
        return result[0];
    }

    async getMomentById(momentId) {
        // const statement = `SELECT moment.id as id, moment.content as content, moment.createAt as createTime, moment.updateAt as updateTime,
        //                           JSON_OBJECT("id", user.id, "name", user.name) as author
        // FROM moment
        // LEFT JOIN user ON moment.user_id = user.id
        // WHERE moment.id = ?;`;
        const statement = `SELECT
        	moment.id as id, moment.content as content, moment.createAt as createTime, moment.updateAt as updateTime, 
        	JSON_OBJECT("userId", user.id, "userName", user.name, "avatarUrl", user.avatar_url) as author,
            
        	IF(COUNT(label.id), JSON_ARRAYAGG(JSON_OBJECT("id", label.id, "name", label.name)), NULL) as labels,
            
        	(SELECT 
        		IF(COUNT(comment.id), JSON_ARRAYAGG(JSON_OBJECT("id", comment.id, "content", comment.content, "commentId", comment.comment_id, "createTime", comment.createAt, "userInfo", JSON_OBJECT("userId", user.id, "userName", user.name, "avatarUrl", user.avatar_url))), NULL)
        	 FROM comment LEFT JOIN user ON comment.user_id = user.id WHERE comment.moment_id = moment.id) as comments,
             (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8888/moment/images/', moment_pic.filename)) FROM moment_pic WHERE moment.id = moment_pic.moment_id) images
        FROM moment
        LEFT JOIN user ON moment.user_id = user.id
        LEFT JOIN moment_label ON moment_label.moment_id = moment.id
        LEFT JOIN label ON label.id = moment_label.label_id
            
        WHERE moment.id = ?
        GROUP BY moment.id;`;

        const result = await connection.execute(statement, [momentId]);

        // 将user存储到数据库中
        return result[0];
    }

    async getMomentList(offset, size) {
        const statement = `SELECT moment.id as id, moment.content as content, moment.createAt as createTime, moment.updateAt as updateTime, 
                                  JSON_OBJECT("userId", user.id, "userName", user.name, "avatarUrl", user.avatar_url) as author,
                           (SELECT COUNT(*) FROM comment WHERE comment.moment_id = moment.id) as commentCount,
                           (SELECT COUNT(*) FROM moment_label WHERE moment_label.moment_id = moment.id) as labelCount,
                           (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8888/moment/images/', moment_pic.filename)) FROM moment_pic WHERE moment.id = moment_pic.moment_id) images
        FROM moment
        LEFT JOIN user ON moment.user_id = user.id
        LIMIT ?, ?;`;

        const result = await connection.execute(statement, [offset, size]);

        // 将user存储到数据库中
        return result[0];
    }

    async updateById(content, momentId) {
        const statement = `UPDATE moment SET content = ? WHERE id = ?;`;

        const result = await connection.execute(statement, [content, momentId]);

        return result[0];
    }

    async removeById(momentId) {
        const statement = `DELETE FROM moment WHERE id = ?;`;

        const result = await connection.execute(statement, [momentId]);

        return result[0];
    }

    async hasLabel(momentId, labelId) {
        console.log(1);
        const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`;

        const [result] = await connection.execute(statement, [momentId, labelId]);

        return result[0] ? true : false;
    }

    async addLabel(momentId, labelId) {
        const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`;

        const result = await connection.execute(statement, [momentId, labelId]);

        return result[0];
    }
}

module.exports = new MomentService();