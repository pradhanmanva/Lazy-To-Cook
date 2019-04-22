const CartModel = require("../models/CartModel");
const UserModel = require("../models/UserModel");

const DBUtil = require("../utils/DBUtil");

const CART_TABLE = require("../tables/CartTable");
const USER_TABLE = require("../tables/UserTable");

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
        throw new Error('Error: Cannot GET all categories.');
    }
}

module.exports = CartHandler;