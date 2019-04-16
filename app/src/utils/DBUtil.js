const mysql = require("mysql");

class DBUtil {

    constructor() {}

    getConnection() /* returns Promise */ {
        const host = 'localhost';
        const port = 8889;
        const user = 'root';
        const password = 'root';
        const database = 'lazytocook';
        return new Promise(function(resolve, reject) {
            const connection = mysql.createConnection({
                host: host,
                user: user,
                password: password,
                port: port,
                database: database
            });
            connection.connect(function (error) {
                if (error) {
                    throw reject(error);
                }
                resolve(connection);
            });
        });
    }

    beginTransaction(connection) /* : returns Promise */{
        return new Promise(function(resolve, reject) {
            connection.beginTransaction((error)=> {
                if (error) {
                    connection.rollback(function() {
                        throw error;
                    });
                    reject(error);
                }
                resolve(connection);
            });
        });
    }

    commitTransaction(connection, result)  /* : returns Promise */ {
        return new Promise(function(resolve, reject) {
            connection.commit(function(err) {
                if (err) {
                    reject({
                        error: err,
                        connection : connection
                    });
                }
                resolve(result);
            })
        });
    }

    rollbackTransaction(connection) {
        return new Promise(function(resolve, reject) {
            connection.rollback(function(err) {
                if (err) {
                    reject({
                        error: err,
                        connection : connection
                    });
                }
                resolve();
            })
        });
    }

    query(connection, query, value) /* : returns Promise */ {
        return new Promise(function(resolve, reject) {
            connection.query(query, value, function(error, results, fields) {
                if (error) {
                    reject({
                        connection: connection, 
                        error : error
                    });
                }
                resolve({
                    connection: connection, 
                    results: results, 
                    fields: fields
                });
            });
        });
    }
}

module.exports = DBUtil;