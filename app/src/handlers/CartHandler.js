const CartModel = require("../models/CartModel");
const UserModel = require("../models/UserModel");

const DBUtil = require("../utils/DBUtil");
const OrderUtil = require("../utils/OrderUtil");

const CART_TABLE = require("../tables/CartTable");
const USER_TABLE = require("../tables/UserTable");
const ITEM_TABLE = require("../tables/ItemTable");
const CARTITEM_TABLE = require("../tables/CartItemTable");

class CartHandler {
    constructor() {

    }

    fetchAll(user /* UserModel */) {
        if (user && user.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${CART_TABLE.NAME} INNER JOIN ${USER_TABLE.NAME} ON ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID}=${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.USER} WHERE ${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.USER} = ? AND ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.IS_DELETED} = false`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.beginTransaction(connection);
            }).then(function(connection) {
                return dbUtil.query(connection, selectQuery, user.id);
            }).then(function(result) {
                return dbUtil.commitTransaction(result.connection, result.results);
            }).then(function (results) {
                return results.map(function (result, index, arr) {
                    return new CartModel(new String(result[CART_TABLE.COLUMNS.ID]),
                        result[CART_TABLE.COLUMNS.NAME], null);
                });
            });
        }
        throw new Error('Error: Cannot GET all carts.');
    }

    fetch(cart /* : CartModel */) {
        if (cart && cart.id && cart.user && cart.user.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${CART_TABLE.NAME} INNER JOIN ${USER_TABLE.NAME} ON ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID}=${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.USER} WHERE ${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.ID} = ? AND ${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.USER} = ? AND ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.IS_DELETED} = false`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.beginTransaction(connection);
            }).then(function(connection) {
                return dbUtil.query(connection, selectQuery, [cart.id, cart.user.id]);
            }).then(function(result){
                if (result.results && result.results.length) {
                    const itemsQuery = `SELECT ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.PRICE}, ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.QUANTITY} FROM ${ITEM_TABLE.NAME} INNER JOIN ${CARTITEM_TABLE.NAME} ON ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ITEM}=${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.ID} WHERE ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ID} = ?`;
                    return dbUtil.query(result.connection, itemsQuery, cart.id);
                } else {
                    return dbUtil.rollbackTransaction(result.connection).then(function () {
                        return Promise.reject(new Error("Error: Invalid user cart."));
                    });
                }
            }).then(function(result) {
                return dbUtil.commitTransaction(result.connection, result.results);
            }).then(function (results) {
                const amount = OrderUtil.calculateOrderAmount(results.map(function(result){
                    return {
                        price : parseFloat(result[ITEM_TABLE.COLUMNS.PRICE]),
                        quantity : parseInt(result[CARTITEM_TABLE.COLUMNS.QUANTITY])
                    }
                }))
                return {
                    cart : new CartModel(cart.id, null, null),
                    amount : amount
                }
            });
        }
        throw new Error('Error: Cannot GET cart.');
    }
}

module.exports = CartHandler;