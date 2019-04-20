const RestaurantModel = require('../models/RestaurantModel');
const DBUtil = require('../utils/DBUtil');

const RESTAURANT_TABLE = require('../tables/RestaurantTable');
const RESTAURANT_AUTH_TABLE = require('../tables/RestaurantAuthenticationTable');

const bcrypt = require('bcrypt');

class RestaurantHandler {
    constructor() {
    }

    fetch(restaurant /* : RestaurantModel */) {
        if (restaurant && restaurant.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${RESTAURANT_TABLE.NAME} WHERE ${RESTAURANT_TABLE.COLUMNS.ID} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, restaurant.id);
            }).then(function (result) {
                return result.results.map(function (result, index, arr) {
                    return new RestaurantModel(String(result[RESTAURANT_TABLE.COLUMNS.ID]), result[RESTAURANT_TABLE.COLUMNS.NAME], String(result[RESTAURANT_TABLE.COLUMNS.CONTACT]), result[RESTAURANT_TABLE.COLUMNS.EMAIL], result[RESTAURANT_TABLE.COLUMNS.WEBSITE]);
                })[0];
            });
        }
        throw new Error('Invalid Operation: Cannot GET all restaurants.');
    }

    register(authCredentials /* : RestaurantAuthenticationModel */) {
        const restaurant = authCredentials.restaurant;
        const dbUtil = new DBUtil();
        const authenticationInsertQuery = `INSERT INTO ${RESTAURANT_AUTH_TABLE.NAME} SET ?`;
        let authenticationColumnValues = {
            [RESTAURANT_AUTH_TABLE.COLUMNS.USERNAME]: authCredentials.username,
            [RESTAURANT_AUTH_TABLE.COLUMNS.PASSWORD]: authCredentials.password
        };
        const insertQuery = `INSERT INTO ${RESTAURANT_TABLE.NAME} SET ?`;
        const columnValues = {
            [RESTAURANT_TABLE.COLUMNS.NAME]: restaurant.name,
            [RESTAURANT_TABLE.COLUMNS.CONTACT]: restaurant.contact,
            [RESTAURANT_TABLE.COLUMNS.EMAIL]: restaurant.email,
            [RESTAURANT_TABLE.COLUMNS.WEBSITE]: restaurant.website
        };
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
        }).then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, insertQuery, columnValues);
        }).then(function (result) {
            authenticationColumnValues[RESTAURANT_AUTH_TABLE.COLUMNS.ID] = result.results.insertId.toString();
            return result;
        }).then(function (result) {
            return dbUtil.query(result.connection, authenticationInsertQuery, authenticationColumnValues);
        }).then(function (result) {
            return dbUtil.commitTransaction(result.connection, result.results);
        }).then(function (result) {
            restaurant.id = authenticationColumnValues[RESTAURANT_AUTH_TABLE.COLUMNS.ID];
            return restaurant;
        });
    }

    validate(authCredentials /* : RestaurantAuthenticationModel */) {
        if (authCredentials && authCredentials.username && authCredentials.password) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT ${RESTAURANT_AUTH_TABLE.COLUMNS.ID}, ${RESTAURANT_AUTH_TABLE.COLUMNS.PASSWORD} FROM ${RESTAURANT_AUTH_TABLE.NAME} WHERE ${RESTAURANT_AUTH_TABLE.COLUMNS.USERNAME} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, authCredentials.username);
            }).then(function (result) {
                if (result && result.results && result.results.length && bcrypt.compareSync(authCredentials.password, result.results[0][RESTAURANT_AUTH_TABLE.COLUMNS.PASSWORD])) {
                    return result.results[0][RESTAURANT_AUTH_TABLE.COLUMNS.ID].toString();
                }
                throw new Error("Invalid credentials.");
            });
        }
        throw new Error('Insufficient data to validate.');
    }

    update(restaurant /* : RestaurantModel */) {
        const dbUtil = new DBUtil();
        const updateQuery = `UPDATE ${RESTAURANT_TABLE.NAME} SET ${RESTAURANT_TABLE.COLUMNS.NAME} = ?, ${RESTAURANT_TABLE.COLUMNS.CONTACT} = ?, ${RESTAURANT_TABLE.COLUMNS.EMAIL} = ?, ${RESTAURANT_TABLE.COLUMNS.WEBSITE} = ? WHERE ${RESTAURANT_TABLE.COLUMNS.ID} = ?`;
        const columnValues = [
            restaurant.name,
            restaurant.contact,
            restaurant.email,
            restaurant.website,
            restaurant.id
        ];
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, updateQuery, columnValues);
        }).then(function (result) {
            return restaurant;
        });
    }

    delete(restaurant /* : RestaurantModel */) {
        const dbUtil = new DBUtil();
        const deleteQuery = `DELETE FROM ${RESTAURANT_TABLE.NAME} WHERE ${RESTAURANT_TABLE.COLUMNS.ID} = ?`;
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, deleteQuery, restaurant.id);
        });
    }

}

module.exports = RestaurantHandler;