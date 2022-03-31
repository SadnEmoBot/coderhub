const mysql = require('mysql2');

const {
   MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD
} = require('./config');

const connections = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD
})

connections.getConnection((err, conn) => {
    conn.connect((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('连接成功');
        }
    })
    // if (err) throw err;
    // conn.query('SELECT * FROM MYSQL_DATABASE', (err, res, fields) => {
    //     conn.release();
    //     if (err) throw err;
    // })
})

module.exports = connections.promise();