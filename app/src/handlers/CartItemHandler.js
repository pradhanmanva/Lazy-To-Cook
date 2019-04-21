const CartModel = require("../models/CartModel");
const CartItemModel = require("../models/CartItemModel");
const ItemModel = require("../models/ItemModel");

const DBUtil = require("../utils/DBUtil");

const CART_TABLE = require("../tables/CartTable");
const CARTITEM_TABLE = require("../tables/CartItemTable");
const ITEM_TABLE = require("../tables/ItemTable");
const CATEGORY_TABLE = require("../tables/CategoryTable");
const USER_TABLE = require('../tables/UserTable');

class CartItemHandler {
    constructor() {

    }

    fetchAll(cart) {
        if (cart && cart.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${ITEM_TABLE.NAME} INNER JOIN ${CARTITEM_TABLE.NAME} ON ${CARTITEM_TABLE.COLUMNS.ITEM}=${ITEM_TABLE.COLUMNS.ID} INNER JOIN ${CATEGORY_TABLE.NAME} ON ${CATEGORY_TABLE.COLUMNS.ID}=${ITEM_TABLE.COLUMNS.ID} WHERE ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ID} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, cart.id);
            }).then(function (result) {
                return result.results.map(function (result, index, arr) {
                    return new CartItemModel(
                        String(result[CARTITEM_TABLE.COLUMNS.ID]),
                        new ItemModel(result[ITEM_TABLE.COLUMNS.ID], result[ITEM_TABLE.COLUMNS.NAME], result[ITEM_TABLE.COLUMNS.DESCRIPTION], result[ITEM_TABLE.COLUMNS.PRICE], new RestaurantItemCategoryModel(result[CATEGORY_TABLE.COLUMNS.ID],result[CATEGORY_TABLE.COLUMNS.NAME],result[CATEGORY_TABLE.COLUMNS.RESTAURANT])),
                        result[CARTITEM_TABLE.COLUMNS.QUANTITY]
                    );
                });
            });
        }
        throw new Error('Error: Cannot GET all categories.');
    }

    insert(cart /* CartModel */, cartItem /* CartItemModel */) {
        if (!cart || !cart.id || !cart.user || !cart.user.id) {
            throw new Error("Insufficient input.");
        }

        const validationQuery = `SELECT * FROM ${CART_TABLE.NAME} INNER JOIN ${USER_TABLE.NAME} ON ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID}=${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.USER} WHERE ${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.ID} = ? AND ${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.USER} = ? AND ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.IS_DELETED} = false`;
        const validationColumnValues = [
            cart.id,
            cart.user.id
        ];

        const insertQuery = `INSERT INTO ${CARTITEM_TABLE.NAME} SET ?`;
        const insertColumnValues = {
            [CARTITEM_TABLE.COLUMNS.ID]: cartItem.id,
            [CARTITEM_TABLE.COLUMNS.QUANTITY]: cartItem.quantity,
            [CARTITEM_TABLE.COLUMNS.ITEM]: cartItem.item
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
}

module.exports = CartItemHandler;