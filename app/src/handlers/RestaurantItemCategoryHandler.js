const DBUtil = require("../utils/DBUtil");

const CATEGORY_TABLE = require('../tables/RestaurantItemCategoryTable');

const RestaurantModel = require("../models/RestaurantModel");
const RestaurantItemCategoryModel = require("../models/RestaurantItemCategoryModel");

class RestaurantItemCategoryHandler {
    constructor() {
    }

    fetchAll(restaurant /* : RestaurantModel */) {
        if (restaurant && restaurant.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${CATEGORY_TABLE.NAME} WHERE ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.RESTAURANT} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, restaurant.id);
            }).then(function (result) {
                return result.results.map(function (result, index, arr) {
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
            const selectQuery = `SELECT * FROM ${CATEGORY_TABLE.NAME} WHERE ${CATEGORY_TABLE.COLUMNS.ID} = ? AND ${CATEGORY_TABLE.COLUMNS.RESTAURANT} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, [category.id, category.restaurant.id]);
            }).then(function (result) {
                const categories = result.results.map(function (result, index, arr) {
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
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, insertQuery, columnValues);
        }).then(function (result) {
            return new RestaurantItemCategoryModel(String(result.results.insertId), category.name, category.restaurant);
        });
    }

    update(category /* : RestaurantItemCategoryModel */) {
        const dbUtil = new DBUtil();
        const updateQuery = `UPDATE ${CATEGORY_TABLE.NAME} SET ${CATEGORY_TABLE.COLUMNS.NAME} = ? WHERE ${CATEGORY_TABLE.COLUMNS.ID} = ? AND ${CATEGORY_TABLE.COLUMNS.RESTAURANT} = ?`;
        const columnValues = [
            category.name,
            category.id,
            category.restaurant.id
        ];
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, updateQuery, columnValues);
        }).then(function (result) {
            if (result.results.affectedRows === 0) {
                throw new Error("Unauthorized update or no such record found.");
            }
            return category;
        });
    }

    delete(category /* : RestaurantItemCategoryModel */) {
        const dbUtil = new DBUtil();
        const deleteQuery = `DELETE FROM ${CATEGORY_TABLE.NAME} WHERE ${CATEGORY_TABLE.COLUMNS.ID} = ? AND ${CATEGORY_TABLE.COLUMNS.RESTAURANT} = ?`;
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, deleteQuery, [category.id, category.restaurant.id]);
        }).then(function (result) {
            if (result.results.affectedRows === 0) {
                throw new Error("Unauthorized delete or no matching record found.");
            }
        });
    }
}

module.exports = RestaurantItemCategoryHandler;