const CartModel = require("../models/CartModel");
const CartItemModel = require("../models/CartItemModel");
const ItemModel = require("../models/ItemModel");

const DBUtil = require("../utils/DBUtil");

const CART_TABLE = require("../tables/CartTable");
const CARTITEM_TABLE = require("../tables/CartItemTable");
const ITEM_TABLE = require("../tables/ItemTable");

class CartItemHandler {
    constructor() {

    }

    fetchAll(cart) {
        if (cart && cart.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${CARTITEM_TABLE.NAME} LEFT JOIN ${ITEM_TABLE.NAME} ON ${CARTITEM_TABLE.COLUMNS.ITEM}=${ITEM_TABLE.COLUMNS.ID} WHERE ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ID} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, cart.id);
            }).then(function (result) {
                return result.results.map(function (result, index, arr) {
                    return new CartItemModel(
                        String(result[CARTITEM_TABLE.COLUMNS.ID]),
                        new ItemModel(result[ITEM_TABLE.COLUMNS.ID], result[ITEM_TABLE.COLUMNS.NAME], result[ITEM_TABLE.COLUMNS.DESCRIPTION], result[ITEM_TABLE.COLUMNS.PRICE], result[ITEM_TABLE.COLUMNS.CATEGORY]),
                        result[CARTITEM_TABLE.COLUMNS.QUANTITY]
                    );
                });
            });
        }
        throw new Error('Error: Cannot GET all categories.');
    }
}

module.exports = CartItemHandler;