const RestaurantModel = require('../models/RestaurantModel');
const DBUtil = require('../utils/DBUtil');

const TABLE = require('../tables/AddressTable');

class RestaurantHandler {
    constructor() {}

    fetch(restaurant /* : RestaurantModel */) {
        if (restaurant && restaurant.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${TABLE.NAME} WHERE ${TABLE.COLUMNS.ID} = ?`
            return dbUtil.getConnection().then(function(connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, restaurant.id);
            }).then(function(result) {
                return result.results.map(function(result, index, arr) {
                    return new RestaurantModel(new String(result[TABLE.COLUMNS.ID]), result[TABLE.COLUMNS.NAME], new String(result[TABLE.COLUMNS.CONTACT]), result[TABLE.COLUMNS.EMAIL], result[TABLE.COLUMNS.WEBSITE]);
                })[0];
            });
        }
        throw new Error('Invalid Operation: Cannot GET all restaurants.');
    }

    insert(restaurant /* : RestaurantModel */) {
        const dbUtil = new DBUtil();
        const insertQuery = `INSERT INTO ${TABLE.NAME} SET ?`;
        const columnValues = {
            [TABLE.COLUMNS.NAME] : restaurant.name,
            [TABLE.COLUMNS.CONTACT] : restaurant.contact,
            [TABLE.COLUMNS.EMAIL] : restaurant.email,
            [TABLE.COLUMNS.WEBSITE] : restaurant.website   
        }
        return dbUtil.getConnection().then(function(connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, insertQuery, columnValues);
        }).then(function(result) {
            return {
                ... columnValues,
                id : new String(result.results.insertId)
            }
        });
    }

    update(restaurant /* : RestaurantModel */) {
        const dbUtil = new DBUtil();
        const updateQuery = `UPDATE ${TABLE.NAME} SET ${TABLE.COLUMNS.NAME} = ?, ${TABLE.COLUMNS.CONTACT} = ?, ${TABLE.COLUMNS.EMAIL} = ?, ${TABLE.COLUMNS.WEBSITE} = ? WHERE ${TABLE.COLUMNS.ID} = ?`;
        const columnValues = [
            restaurant.name,
            restaurant.contact,
            restaurant.email,
            restaurant.website,
            restaurant.id
        ]
        return dbUtil.getConnection().then(function(connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, updateQuery, columnValues);
        }).then(function(result) {
            return restaurant;
        });
    }

    delete(restaurant /* : RestaurantModel */) {
        const dbUtil = new DBUtil();
        const deleteQuery = `DELETE FROM ${TABLE.NAME} WHERE ${TABLE.COLUMNS.ID} = ?`
        return dbUtil.getConnection().then(function(connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, deleteQuery, restaurant.id);
        });
    }

}

module.exports = RestaurantHandler;