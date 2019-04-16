const ItemModel = require("../models/ItemModel");
const RestaurantItemCategoryModel = require("../models/RestaurantItemCategoryModel");

const DBUtil = require("../utils/DBUtil");

const CATEGORY_TABLE = require('../tables/RestaurantItemCategoryTable');
const ITEM_TABLE = require("../tables/ItemTable");
const ITEMOUTLET_TABLE = require("../tables/ItemOutletTable");

class MenuItemHandler {
    constructor() {}

    fetchAll(outlet /* : OutletModel */) {
        if (outlet && outlet.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${ITEMOUTLET_TABLE.NAME} LEFT JOIN ${ITEM_TABLE.NAME} ON ${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.ITEM} = ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.ID} LEFT JOIN ${CATEGORY_TABLE.NAME} ON ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.CATEGORY} = ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.ID} WHERE ${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.OUTLET} = ?`
            return dbUtil.getConnection().then(function(connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, outlet.id);
            }).then(function(result) {
                return result.results.map(function(result, index, arr) {
                    return new ItemModel(result[ITEM_TABLE.COLUMNS.ID].toString(), result[ITEM_TABLE.COLUMNS.NAME], result[ITEM_TABLE.COLUMNS.DESCRIPTION], result[ITEM_TABLE.COLUMNS.PRICE], new RestaurantItemCategoryModel(result[CATEGORY_TABLE.COLUMNS.ID], result[CATEGORY_TABLE.COLUMNS.NAME], null));
                });
            });
        }
        throw new Error('Error: Cannot GET all items.');
    }

    fetch(item /* : ItemModel */) {
        if (item && item.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${ITEMOUTLET_TABLE.NAME} LEFT JOIN ${ITEM_TABLE.NAME} ON ${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.ITEM} = ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.ID} LEFT JOIN ${CATEGORY_TABLE.NAME} ON ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.CATEGORY} = ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.ID} WHERE ${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.ITEM} = ?`
            return dbUtil.getConnection().then(function(connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, item.id);
            }).then(function(result) {
                return result.results.map(function(result, index, arr) {
                    return new ItemModel(result[ITEM_TABLE.COLUMNS.ID].toString(), result[ITEM_TABLE.COLUMNS.NAME], result[ITEM_TABLE.COLUMNS.DESCRIPTION], result[ITEM_TABLE.COLUMNS.PRICE], new RestaurantItemCategoryModel(result[CATEGORY_TABLE.COLUMNS.ID], result[CATEGORY_TABLE.COLUMNS.NAME], null));
                })[0];
            });
        }
        throw new Error('Error: Cannot GET specified item.');
    }

    insert(item /* : ItemModel */, outlet /* : OutletModel */) {
        const dbUtil = new DBUtil();

        // insert item and then insert item-outlet relationship.
        const itemInsertQuery = `INSERT INTO ${ITEM_TABLE.NAME} SET ?`;
        const itemColumnValues = {
            [ITEM_TABLE.COLUMNS.NAME] : item.name,
            [ITEM_TABLE.COLUMNS.DESCRIPTION] : item.description,
            [ITEM_TABLE.COLUMNS.PRICE] : item.price,
            [ITEM_TABLE.COLUMNS.CATEGORY] : item.category.id
        }

        const itemOutletInsertQuery = `INSERT INTO ${ITEMOUTLET_TABLE.NAME} SET ?`;
        let itemOutletColumnValues = {
            [ITEMOUTLET_TABLE.COLUMNS.OUTLET] : outlet.id
        }
        return dbUtil.getConnection().then(function(connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
        }).then(function(connection) {
            return dbUtil.query(connection, itemInsertQuery, itemColumnValues);
        }).then(function(result) {
            itemOutletColumnValues[ITEMOUTLET_TABLE.COLUMNS.ITEM] = new String(result.results.insertId);
            return dbUtil.query(result.connection, itemOutletInsertQuery, itemOutletColumnValues);
        }).then(function(result) {
            item.id = itemOutletColumnValues[ITEMOUTLET_TABLE.COLUMNS.ITEM];
            return {
                connection: result.connection,
                result: item
            }
        }).then(function(result) {
            return dbUtil.commitTransaction(result.connection, result.result);
        });
    }
    
    update(item /* : ItemModel */) {
        const dbUtil = new DBUtil();
        const itemUpdateQuery = `UPDATE ${ITEM_TABLE.NAME} SET ${ITEM_TABLE.COLUMNS.NAME} = ? , ${ITEM_TABLE.COLUMNS.DESCRIPTION} = ?, ${ITEM_TABLE.COLUMNS.PRICE} = ?, ${ITEM_TABLE.COLUMNS.CATEGORY} = ? WHERE ${ITEM_TABLE.COLUMNS.ID} = ?`;
        const itemColumnValues = [
            item.name,
            item.description,
            item.price,
            item.category.id,
            item.id
        ]

        return dbUtil.getConnection().then(function(connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, itemUpdateQuery, itemColumnValues);
        }).then(function(result) {
            return item;
        });
    }
    
    delete(item /* : ItemModel */) {
        const dbUtil = new DBUtil();
        const deleteQuery = `DELETE FROM ${ITEM_TABLE.NAME} WHERE ${ITEM_TABLE.COLUMNS.ID} = ?`
        return dbUtil.getConnection().then(function(connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, deleteQuery, item.id);
        });
    }
}

module.exports = MenuItemHandler;