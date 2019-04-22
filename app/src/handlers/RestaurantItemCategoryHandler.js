const DBUtil = require("../utils/DBUtil");

const CATEGORY_TABLE = require('../tables/RestaurantItemCategoryTable');
const RESTAURANT_TABLE = require('../tables/RestaurantTable');

const RestaurantModel = require("../models/RestaurantModel");
const RestaurantItemCategoryModel = require("../models/RestaurantItemCategoryModel");

class RestaurantItemCategoryHandler {
    constructor() {
    }

    fetchAll(restaurant /* : RestaurantModel */) {
        if (restaurant && restaurant.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${CATEGORY_TABLE.NAME} INNER JOIN ${RESTAURANT_TABLE.NAME} ON ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.ID}=${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.RESTAURANT} WHERE ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.RESTAURANT} = ? AND ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.IS_DELETED} = false AND ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.IS_DELETED} = false`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.beginTransaction(connection);
            }).then(function(connection) {
                return dbUtil.query(connection, selectQuery, restaurant.id);
            }).then(function(result){
                return dbUtil.commitTransaction(result.connection, result.results);
            }).then(function (result) {
                return result.map(function (result, index, arr) {
                    return new RestaurantItemCategoryModel(
                        String(result[CATEGORY_TABLE.COLUMNS.ID]),
                        result[CATEGORY_TABLE.COLUMNS.NAME],
                        new RestaurantModel(restaurant.id, null, null, null, null));
                });
            });
        }
        throw new Error('Error: Cannot GET all categories.');
    }

    fetch(category /* : RestaurantItemCategoryModel */) {
        if (category && category.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${CATEGORY_TABLE.NAME} INNER JOIN ${RESTAURANT_TABLE.NAME} ON ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.ID}=${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.RESTAURANT} WHERE ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.ID} = ? AND ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.RESTAURANT} = ? AND ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.IS_DELETED} = false AND ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.IS_DELETED} = false`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.beginTransaction(connection);
                
            }).then(function(connection) {
                return dbUtil.query(connection, selectQuery, [category.id, category.restaurant.id]);
            }).then(function(result) {
                return dbUtil.commitTransaction(result.connection, result.results);
            }).then(function (result) {
                const categories = result.map(function (result, index, arr) {
                    return new RestaurantItemCategoryModel(String(result[CATEGORY_TABLE.COLUMNS.ID]), result[CATEGORY_TABLE.COLUMNS.NAME], new RestaurantModel(result[CATEGORY_TABLE.COLUMNS.RESTAURANT], null, null, null, null));
                });
                if (categories && categories.length) {
                    return categories[0];
                }
                return null;
            });
        }
        return new RestaurantItemCategoryModel(null, null, null);
    }

    insert(category /* : RestaurantItemCategoryModel */) {
        const dbUtil = new DBUtil();
        const insertQuery = `INSERT INTO ${CATEGORY_TABLE.NAME} SET ?`;
        const columnValues = {
            [CATEGORY_TABLE.COLUMNS.NAME]: category.name,
            [CATEGORY_TABLE.COLUMNS.RESTAURANT]: category.restaurant.id
        };
        const nonDeletedRestaurantSelectQuery =`SELECT ${RESTAURANT_TABLE.COLUMNS.ID} FROM ${RESTAURANT_TABLE.NAME} WHERE ${RESTAURANT_TABLE.COLUMNS.ID} = ? AND ${RESTAURANT_TABLE.COLUMNS.IS_DELETED} = false`;
        return dbUtil.getConnection().then(function(connection) {
            if (!connection) {
                return Promise.reject(new Error('Some internal error occurred.'));
            }
            return dbUtil.beginTransaction(connection);
        }).then(function(connection) {
            return dbUtil.query(connection, nonDeletedRestaurantSelectQuery, category.restaurant.id);
        }).then(function (result) {
            if (!result || !result.results || result.results.length === 0) {
                return dbUtil.rollbackTransaction(result.connection).then(function () {
                    const err = "Invalid Operation: Cannot add category to a non-existent restaurant.";
                    return Promise.reject(new Error(err));
                })
            } else {
                return dbUtil.query(result.connection, insertQuery, columnValues);
            }
        }).then(function(result) {
            return dbUtil.commitTransaction(result.connection, result.results);
        }).then(function (result) {
            return new RestaurantItemCategoryModel(String(result.insertId), category.name, category.restaurant);
        });
    }

    update(category /* : RestaurantItemCategoryModel */) {
        const dbUtil = new DBUtil();
        const updateQuery = `UPDATE ${CATEGORY_TABLE.NAME} INNER JOIN ${RESTAURANT_TABLE.NAME} ON ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.ID}=${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.RESTAURANT} SET ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.NAME} = ? WHERE ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.ID} = ? AND ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.RESTAURANT} = ? AND ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.IS_DELETED} = false`;
        const columnValues = [
            category.name,
            category.id,
            category.restaurant.id
        ];
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
            
        }).then(function(connection) {
            return dbUtil.query(connection, updateQuery, columnValues);
        }).then(function(result) {
            return dbUtil.commitTransaction(result.connection, result.results);
        }).then(function (result) {
            if (result.affectedRows === 0) {
                return Promise.reject(new Error("Invalid operation: Cannot update category of non-existent restaurant."));
            }
            return category;
        });
    }

    delete(category /* : RestaurantItemCategoryModel */) {
        const dbUtil = new DBUtil();
        const deleteQuery = `UPDATE ${CATEGORY_TABLE.NAME} INNER JOIN ${RESTAURANT_TABLE.NAME} ON ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.ID}=${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.RESTAURANT} SET ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.IS_DELETED} = true WHERE ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.ID} = ? AND ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.RESTAURANT} = ? AND ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.IS_DELETED} = false`;
        // const deleteQuery = `DELETE FROM ${CATEGORY_TABLE.NAME} WHERE ${CATEGORY_TABLE.COLUMNS.ID} = ? AND ${CATEGORY_TABLE.COLUMNS.RESTAURANT} = ?`;
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
            
        }).then(function(connection) {
            return dbUtil.query(connection, deleteQuery, [category.id, category.restaurant.id]);
        }).then(function(result) {
            return dbUtil.commitTransaction(result.connection, result.results);
        }).then(function (result) {
            if (result.affectedRows === 0) {
                return Promise.reject(new Error("Invalid operation: Cannot delete category of non-existent restaurant."));
            }
        });
    }
}

module.exports = RestaurantItemCategoryHandler;