const CartModel = require("../models/CartModel");
const CartItemModel = require("../models/CartItemModel");

const DBUtil = require("../utils/DBUtil");

const CART_TABLE = require("../tables/CartTable");
const CARTITEM_TABLE = require("../tables/CartItemTable");

class CartItemHandler {
    constructor() {

    }

    fetchAll(cart) {
        if (cart && cart.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${CARTITEM_TABLE.NAME} WHERE ${CARTITEM_TABLE.COLUMNS.ID} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, cart.id);
            }).then(function (result) {
                return result.results.map(function (result, index, arr) {
                    return new CartItemModel(
                        String(result[CARTITEM_TABLE.COLUMNS.ID]),
                        result[CARTITEM_TABLE.COLUMNS.NAME],
                        result[CARTITEM_TABLE.COLUMNS.QUANTITY],
                        new CartModel(cart.id, null, null)
                    );
                });
            });
        }
        throw new Error('Error: Cannot GET all categories.');
    }
}

module.exports = CartItemHandler;