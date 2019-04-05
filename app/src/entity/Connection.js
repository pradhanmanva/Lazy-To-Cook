class Connection {
    constructor() {
        var mysql = require('mysql');

        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            port: 8889,
            database: 'lazytocook'
        });
    }
}

module.exports = Connection;