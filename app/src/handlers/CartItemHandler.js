const CartModel = require("../models/CartModel");
const CartItemModel = require("../models/CartItemModel");
const ItemModel = require("../models/ItemModel");
const RestaurantItemCategoryModel = require("../models/RestaurantItemCategoryModel");

const DBUtil = require("../utils/DBUtil");

const CART_TABLE = require("../tables/CartTable");
const CARTITEM_TABLE = require("../tables/CartItemTable");
const ITEM_TABLE = require("../tables/ItemTable");
const ITEMOUTLET_TABLE = require("../tables/ItemOutletTable");
const OUTLET_TABLE = require("../tables/OutletTable");
const RESTAURANT_TABLE = require("../tables/RestaurantTable");
const CATEGORY_TABLE = require("../tables/CategoryTable");
const USER_TABLE = require('../tables/UserTable');

class CartItemHandler {
    constructor() {

    }

    fetchAll(cart /* : CartModel */) {
        if (cart && cart.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${ITEM_TABLE.NAME} INNER JOIN ${CARTITEM_TABLE.NAME} ON ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ITEM}=${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.ID} INNER JOIN ${CATEGORY_TABLE.NAME} ON ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.ID}=${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.CATEGORY} WHERE ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ID} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.beginTransaction(connection);
            }).then(function(connection) {
                return dbUtil.query(connection, selectQuery, cart.id);
            }).then(function(result) {
                return dbUtil.commitTransaction(result.connection, result.results);
            }).then(function (results) {
                return results.map(function (result, index, arr) {
                    return new CartItemModel(
                        result[CARTITEM_TABLE.COLUMNS.ID].toString(),
                        new ItemModel(result[ITEM_TABLE.COLUMNS.ID].toString(), result[ITEM_TABLE.COLUMNS.NAME], result[ITEM_TABLE.COLUMNS.DESCRIPTION], result[ITEM_TABLE.COLUMNS.PRICE], new RestaurantItemCategoryModel(result[CATEGORY_TABLE.COLUMNS.ID],result[CATEGORY_TABLE.COLUMNS.NAME],result[CATEGORY_TABLE.COLUMNS.RESTAURANT])),
                        result[CARTITEM_TABLE.COLUMNS.QUANTITY]
                    );
                });
            });
        }
        throw new Error('Error: Cannot GET all cart items.');
    }

    insert(cart /* CartModel */, cartItem /* CartItemModel */) {
        if (!cart || !cart.id || !cart.user || !cart.user.id) {
            throw new Error("Insufficient input.");
        }

        // validate if cart belongs to user.
        // also validate if item is not deleted or from a deleted outlet or restaurant.
        const validationQuery = `SELECT * FROM ${CART_TABLE.NAME} INNER JOIN ${USER_TABLE.NAME} ON ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID}=${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.USER} WHERE ${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.ID} = ? AND ${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.USER} = ? AND ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.IS_DELETED} = false`;
        const validationColumnValues = [
            cart.id,
            cart.user.id
        ];

        // const validationQuery2 = `SELECT * FROM ${ITEMOUTLET_TABLE.NAME} INNER JOIN ${ITEM_TABLE.NAME} `;
        const validationQuery2 = `SELECT * FROM ${ITEMOUTLET_TABLE.NAME} INNER JOIN ${ITEM_TABLE.NAME} ON ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.ID}=${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.ITEM} INNER JOIN ${OUTLET_TABLE.NAME} ON ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.ID}=${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.OUTLET} INNER JOIN ${RESTAURANT_TABLE.NAME} ON ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.ID}=${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.RESTAURANT} WHERE ${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.ITEM} = ? AND ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.IS_DELETED} = false AND ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.IS_DELETED} = false AND ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.IS_DELETED} = false`;
        const validationColumnValues2 = [
            cartItem.item.id
        ]

        const insertQuery = `INSERT INTO ${CARTITEM_TABLE.NAME} SET ?`;
        const insertColumnValues = {
            [CARTITEM_TABLE.COLUMNS.ID]: cartItem.id,
            [CARTITEM_TABLE.COLUMNS.QUANTITY]: cartItem.quantity,
            [CARTITEM_TABLE.COLUMNS.ITEM]: cartItem.item.id
        };
        const dbUtil = new DBUtil();
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
        }).then(function (connection) {
            return dbUtil.query(connection, validationQuery, validationColumnValues);
        }).then(function (result) {
            if (!result || !result.results || result.results.length === 0) {
                return dbUtil.rollbackTransaction(result.connection).then(function () {
                    return Promise.reject(new Error("Invalid Operation: Cannot add item to a cart of non-existent user."));
                });
            } else {
                return dbUtil.query(result.connection, validationQuery2, validationColumnValues2);
            }
        }).then(function (result) {
            if (!result || !result.results || result.results.length === 0) {
                return dbUtil.rollbackTransaction(result.connection).then(function () {
                    return Promise.reject(new Error("Invalid Operation: Cannot add item of non-existent outlet or restaurant into cart."));
                });
            } else {
                return dbUtil.query(result.connection, insertQuery, insertColumnValues);
            }
        }).then(function (result) {
            return {
                connection: result.connection,
                result: cartItem
            }
        }).then(function (result) {
            return dbUtil.commitTransaction(result.connection, result.result);
        });
    }

    delete (cart /* : CartModel */, cartItem /* : CartItemModel */) {
        if (!cart || !cart.id || !cart.user || !cart.user.id) {
            throw new Error("Insufficient input.");
        }

        const deleteQuery = `DELETE ${CARTITEM_TABLE.NAME} FROM ${CARTITEM_TABLE.NAME} INNER JOIN ${CART_TABLE.NAME} ON ${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.ID}=${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ID} WHERE ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ID} = ? AND ${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.USER} = ? AND ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ITEM} = ?`;
        const deleteColumnValues = [
            cart.id,
            cart.user.id,
            cartItem.item.id
        ]
        const dbUtil = new DBUtil();
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
        }).then(function(connection) {
            return dbUtil.query(connection, deleteQuery, deleteColumnValues);
        }).then(function(result) {
            return dbUtil.commitTransaction(result.connection, result.results);
        });
    }

    update(cart /* : CartModel */, cartItem /* CartItemModel */) {
        if (!cartItem || !cartItem.id || !cart || !cart.user || !cart.user.id || !cartItem.quantity || !cartItem.item) {
            throw new Error("Insufficient input.");
        }

        const updateQuery = `UPDATE ${CARTITEM_TABLE.NAME} INNER JOIN ${CART_TABLE.NAME} ON ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ID}=${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.ID} INNER JOIN ${USER_TABLE.NAME} ON ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID}=${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.USER} SET ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.QUANTITY} = ? WHERE ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ID} = ? AND ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ITEM} = ? AND ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID} = ? AND ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.IS_DELETED} = false`;
        const updateColumnValues = [
            cartItem.quantity,
            cartItem.id,
            cartItem.item.id,
            cart.user.id
        ]
        const dbUtil = new DBUtil();
        
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
        }).then(function(connection) {
            return dbUtil.query(connection, updateQuery, updateColumnValues);
        }).then(function(result) {
            return dbUtil.commitTransaction(result.connection, result.results);
        });
    }
}

module.exports = CartItemHandler;