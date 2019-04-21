const RestaurantModel = require("../models/RestaurantModel");
const CategoryModel = require("../models/RestaurantItemCategoryModel");

const DBUtil = require("../utils/DBUtil");

const CATEGORY_TABLE = require('../tables/RestaurantItemCategoryTable');
const RESTAURANT_TABLE = require('../tables/RestaurantTable');

class CategoryHandler {

    fetchAll() {
        const dbUtil = new DBUtil();
        const selectQuery = `SELECT * FROM ${CATEGORY_TABLE.NAME} INNER JOIN ${RESTAURANT_TABLE.NAME} ON ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.RESTAURANT}=${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.ID} WHERE ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.IS_DELETED} = false AND ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.IS_DELETED} = false`;
        return dbUtil.getConnection().then(function(connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, selectQuery);
        }).then(function(result) {
            return result.results.map(function(category) {
                const restaurant = new RestaurantModel(category[RESTAURANT_TABLE.COLUMNS.ID], category[RESTAURANT_TABLE.COLUMNS.NAME]);
                return new CategoryModel(category[CATEGORY_TABLE.COLUMNS.ID], category[CATEGORY_TABLE.COLUMNS.NAME], restaurant);
            });
        });
    }
}

module.exports = CategoryHandler;