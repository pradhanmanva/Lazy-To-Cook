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
            const selectQuery = `SELECT * FROM ${CARTITEM_TABLE.NAME} WHERE ${CART}`;
        }
    }
}