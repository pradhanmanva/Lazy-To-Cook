const RestaurantModel = require('../models/RestaurantModel');
const DBUtil = require('../utils/DBUtil');

const RESTAURANT_TABLE = require('../tables/RestaurantTable');

class RestaurantHandler {
    constructor() {}

    fetch(restaurant /* : RestaurantModel */) {
        if (restaurant && restaurant.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${RESTAURANT_TABLE.NAME} WHERE ${RESTAURANT_TABLE.COLUMNS.ID} = ?`
            return dbUtil.getConnection().then(function(connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, restaurant.id);
            }).then(function(result) {
                return result.results.map(function(result, index, arr) {
                    return new RestaurantModel(new String(result[RESTAURANT_TABLE.COLUMNS.ID]), result[RESTAURANT_TABLE.COLUMNS.NAME], new String(result[RESTAURANT_TABLE.COLUMNS.CONTACT]), result[RESTAURANT_TABLE.COLUMNS.EMAIL], result[RESTAURANT_TABLE.COLUMNS.WEBSITE]);
                })[0];
            });
        }
        throw new Error('Invalid Operation: Cannot GET all restaurants.');
    }

    insert(restaurant /* : RestaurantModel */) {
        const dbUtil = new DBUtil();
        const insertQuery = `INSERT INTO ${RESTAURANT_TABLE.NAME} SET ?`;
        const columnValues = {
            [RESTAURANT_TABLE.COLUMNS.NAME] : restaurant.name,
            [RESTAURANT_TABLE.COLUMNS.CONTACT] : restaurant.contact,
            [RESTAURANT_TABLE.COLUMNS.EMAIL] : restaurant.email,
            [RESTAURANT_TABLE.COLUMNS.WEBSITE] : restaurant.website   
        }
        return dbUtil.getConnection().then(function(connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, insertQuery, columnValues);
        }).then(function(result) {
            return new RestaurantModel(new String(result.results.insertId), restaurant.name, restaurant.contact, restaurant.email, restaurant.website);
        });
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
        const deleteQuery = `DELETE FROM ${RESTAURANT_TABLE.NAME} WHERE ${RESTAURANT_TABLE.COLUMNS.ID} = ?`
        return dbUtil.getConnection().then(function(connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, deleteQuery, restaurant.id);
        });
    }

}

module.exports = RestaurantHandler;