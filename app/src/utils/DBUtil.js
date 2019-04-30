const mysql = require("mysql");
const pool  = mysql.createPool({
    connectionLimit : 10,
    port            : 8889,
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'lazytocook',
    dateStrings     : true
});
class DBUtil {

    constructor() {
    }

    getConnection() /* returns Promise */ {
        console.log("Getting database connection");
        return new Promise(function (resolve, reject) {
            pool.getConnection(function(error, connection) {
                if (error) {
                    console.error(error);
                    throw reject(error);
                }
                console.log("Obtained database connection.");
                resolve(connection);
            });
        });
    }

    releaseConnection(connection) {
        console.log("Releasing database connection.");
        connection.release();
    }

    beginTransaction(connection) /* : returns Promise */ {
        return new Promise(function (resolve, reject) {
            console.log("Starting transaction.");
            connection.beginTransaction((error) => {
                if (error) {
                    connection.rollback(function () {
                        throw error;
                    });
                    console.error(error);
                    reject(error);
                }
                resolve(connection);
            });
        });
    }

    commitTransaction(connection, result)  /* : returns Promise */ {
        return new Promise(function (resolve, reject) {
            console.log("Committing transaction and releasing connection.");
            connection.commit(function (err) {
                connection.release();
                if (err) {
                    console.error(error);
                    reject({
                        error: err,
                        connection: connection
                    });
                }
                
                resolve(result);
            })
        });
    }
    

    rollbackTransaction(connection) {
        return new Promise(function (resolve, reject) {
            console.log("Rolling back transaction and releasing connection.");
            connection.rollback(function (err) {
                connection.release();
                if (err) {
                    console.error(error);
                    reject({
                        error: err,
                        connection: connection
                    });
                }
                resolve();
            })
        });
    }

    query(connection, query, value) /* : returns Promise */ {
        return new Promise(function (resolve, reject) {
            connection.query(query, value, function (error, results, fields) {
                console.log("Running query...");
                if (error) {
                    console.error(error);
                    reject({
                        connection: connection,
                        error: error
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