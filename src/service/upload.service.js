const connection = require('../app/database');

class UploadService {
    async saveAvatar(filename, mimetype, size, id) {
        const statement = `INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?);`;

        const result = await connection.execute(statement, [filename, mimetype, size, id]);

        return result[0];
    }

    async getAvatarInfoById(userId) {
        const statement = `SELECT * FROM avatar WHERE user_id = ?;`;

        const [result] = await connection.execute(statement, [userId]);

        // return result[0];
        return result.pop();
    }

    async saveMomentPic(filename, mimetype, size, id, momentId) {
        const statement = `INSERT INTO moment_pic (filename, mimetype, size, user_id, moment_id) VALUES (?, ?, ?, ?, ?);`;

        const result = await connection.execute(statement, [filename, mimetype, size, id, momentId]);

        return result[0];
    }

    async getPicByFilename(filename) {
        const statement = `SELECT * FROM moment_pic WHERE filename = ?;`;

        const [result] = await connection.execute(statement, [filename]);

        return result[0];
    }
}

module.exports = new UploadService();