const OutletModel = require("../models/OutletModel");
const UserModel = require("../models/UserModel");
const ItemModel = require("../models/ItemModel");
const OrderModel = require("../models/OrderModel");
const OrderItemModel = require("../models/OrderItemModel");

const DBUtil = require("../utils/DBUtil");

const OUTLET_TABLE = require('../tables/OutletTable');
const ADDRESS_TABLE = require('../tables/AddressTable');
const CART_TABLE = require('../tables/CartTable');
const CARTITEM_TABLE = require('../tables/CartItemTable');
const ORDER_TABLE = require("../tables/OrderTable");
const ORDERITEM_TABLE = require("../tables/OrderItemTable");
const ITEM_TABLE = require("../tables/ItemTable");
const ITEMOUTLET_TABLE = require("../tables/ItemOutletTable");
const USER_TABLE = require("../tables/UserTable");

const ORDER_STATUS = require("../models/OrderStatus");

const OrderUtil = require("../utils/OrderUtil");
const AppUtil = require("../utils/AppUtil");

class UserOrderHandler {
    constructor() {
    }

    fetchAll(order /* : RestaurantModel */) {
        if (order && order.user && order.user.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${ORDER_TABLE.NAME} INNER JOIN ${OUTLET_TABLE.NAME} ON ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.ID} = ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.OUTLET} INNER JOIN ${USER_TABLE.NAME} ON ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID}=${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.USER} WHERE ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.USER} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.beginTransaction(connection);
            }).then(function(connection) {
                return dbUtil.query(connection, selectQuery, order.user.id);
            }).then(function(result) {
                return dbUtil.commitTransaction(result.connection, result.results);
            }).then(function (result) {
                return result.map(function (result, index, arr) {
                    return new OrderModel(
                                result[ORDER_TABLE.COLUMNS.ID],
                                AppUtil.getLocaleDateString(result[ORDER_TABLE.COLUMNS.DATE]),
                                new UserModel(result[ORDER_TABLE.COLUMNS.USER],result[USER_TABLE.COLUMNS.FIRSTNAME], result[USER_TABLE.COLUMNS.MIDDLENAME], result[USER_TABLE.COLUMNS.LASTNAME], null, null, null, null),
                                new OutletModel(result[ORDER_TABLE.COLUMNS.OUTLET], result[OUTLET_TABLE.COLUMNS.NAME], null, null, null),
                                result[ORDER_TABLE.COLUMNS.STATUS]);
                });
            });
        }
    }

    fetch(order /* : OrderModel */) {
        if (order && order.id && order.user && order.user.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${ORDER_TABLE.NAME} INNER JOIN ${ORDERITEM_TABLE.NAME} ON ${ORDERITEM_TABLE.NAME}.${ORDERITEM_TABLE.COLUMNS.ID}=${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.ID} INNER JOIN ${OUTLET_TABLE.NAME} ON ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.ID} = ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.OUTLET} INNER JOIN ${USER_TABLE.NAME} ON ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID}=${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.USER} WHERE ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.USER} = ? AND ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.ID} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.beginTransaction(connection);
            }).then(function(connection) {
                return dbUtil.query(connection, selectQuery, [order.user.id, order.id]);
            }).then(function(result) {
                return dbUtil.commitTransaction(result.connection, result.results);
            }).then(function (result) {
                const item = result[0];
                const amount = OrderUtil.calculateOrderAmount(result.map(function(result){
                    return {
                        price : parseFloat(result[ORDERITEM_TABLE.COLUMNS.PRICE]),
                        quantity : parseInt(result[ORDERITEM_TABLE.COLUMNS.QUANTITY])
                    }
                }))
                return {
                    order : new OrderModel(
                        item[ORDER_TABLE.COLUMNS.ID],
                        AppUtil.getLocaleDateString(item[ORDER_TABLE.COLUMNS.DATE]),
                        new UserModel(item[ORDER_TABLE.COLUMNS.USER],item[USER_TABLE.COLUMNS.FIRSTNAME], item[USER_TABLE.COLUMNS.MIDDLENAME], item[USER_TABLE.COLUMNS.LASTNAME], null, null, null, null),
                        new OutletModel(item[ORDER_TABLE.COLUMNS.OUTLET], item[OUTLET_TABLE.COLUMNS.NAME], null, null, null),
                        item[ORDER_TABLE.COLUMNS.STATUS],
                        result.map(function (item, index, arr) {
                            return new OrderItemModel(
                                new ItemModel(null, item[ORDERITEM_TABLE.COLUMNS.ITEMNAME], item[ORDERITEM_TABLE.COLUMNS.DESCRIPTION], item[ORDERITEM_TABLE.COLUMNS.PRICE], null, null),
                                item[ORDERITEM_TABLE.COLUMNS.QUANTITY]).toJSON();
                        })),
                    amount : amount
                }
            });
        }
        throw new Error('Error: Cannot GET order.');
    }

    insert(order /* : OrderModel */) {
        if (!order || !order.items || !order.user || !order.user.id) {
            throw new Error("Insufficient input.");
        }
        const dbUtil = new DBUtil();
        const itemIds = order.items.map(function(item) {
            return item.item.id;
        });

        const itemsValidationQuery = `SELECT * FROM ${ITEM_TABLE.NAME} LEFT JOIN ${ITEMOUTLET_TABLE.NAME} ON ${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.ITEM}=${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.ID} WHERE ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.ID} IN (?)`;
        const itemsValidationColumnValues = [itemIds]

        const orderInsertionQuery = `INSERT INTO ${ORDER_TABLE.NAME} SET ?`;
        let orderInsertionColumnValues = {
            [ORDER_TABLE.COLUMNS.USER] : order.user.id
        }

        let itemVsQuantity = {}
        order.items.forEach(item => {
            itemVsQuantity[item.item.id] = item.quantity;
        });
        let items = [];
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
        }).then(function (connection) {
            return dbUtil.query(connection, itemsValidationQuery, itemsValidationColumnValues);
        }).then(function (result) {
            let isNotValid = !result.results;
            isNotValid = isNotValid || (result.results.length != order.items.length);
            isNotValid = isNotValid || (new Set(result.results.map((item)=>{return item[ITEMOUTLET_TABLE.COLUMNS.OUTLET];})).size != 1);
            if ( isNotValid ) {
                return dbUtil.rollbackTransaction(result.connection).then(function () {
                    return Promise.reject(new Error(`Invalid Operation: Either invalid item or cannot order items from multiple outlets.`));
                });
            } else {
                items = result.results.map((item)=> {
                    return {
                        [ORDERITEM_TABLE.COLUMNS.NAME] : item[ITEM_TABLE.COLUMNS.NAME],
                        [ORDERITEM_TABLE.COLUMNS.DESCRIPTION] : item[ITEM_TABLE.COLUMNS.DESCRIPTION],
                        [ORDERITEM_TABLE.COLUMNS.PRICE] : item[ITEM_TABLE.COLUMNS.PRICE],
                        [ORDERITEM_TABLE.COLUMNS.QUANTITY] : itemVsQuantity[item[ITEM_TABLE.COLUMNS.ID]]
                    }
                });
                orderInsertionColumnValues[ORDER_TABLE.COLUMNS.OUTLET] = result.results[0][ITEMOUTLET_TABLE.COLUMNS.OUTLET];
                return dbUtil.query(result.connection, orderInsertionQuery, orderInsertionColumnValues);
            }
        }).then(function (result) {
            const orderId = result.results.insertId.toString();
            orderInsertionColumnValues[ORDER_TABLE.COLUMNS.ID] = result.results.insertId;
            items.forEach(function(item) {
                item[ORDERITEM_TABLE.COLUMNS.ID] = orderId;
            });
            const connection = result.connection;
            let orderItemInsertionColumnValues = items.map((item) => {
                return `(${connection.escape(item[ORDERITEM_TABLE.COLUMNS.ID])}, ${connection.escape(item[ORDERITEM_TABLE.COLUMNS.NAME])}, ${connection.escape(item[ORDERITEM_TABLE.COLUMNS.DESCRIPTION])}, ${connection.escape(item[ORDERITEM_TABLE.COLUMNS.PRICE])}, ${connection.escape(item[ORDERITEM_TABLE.COLUMNS.QUANTITY])})`;
            }).join(",");
            const orderItemInsertionQuery = `INSERT INTO ${ORDERITEM_TABLE.NAME} (${ORDERITEM_TABLE.COLUMNS.ID}, ${ORDERITEM_TABLE.COLUMNS.ITEMNAME}, ${ORDERITEM_TABLE.COLUMNS.DESCRIPTION}, ${ORDERITEM_TABLE.COLUMNS.PRICE}, ${ORDERITEM_TABLE.COLUMNS.QUANTITY}) VALUES ${orderItemInsertionColumnValues}`;
            return dbUtil.query(result.connection, orderItemInsertionQuery, orderItemInsertionColumnValues);
        }).then(function(result) {
            const deleteFromCartQuery = `DELETE ${CARTITEM_TABLE.NAME} FROM ${CARTITEM_TABLE.NAME} INNER JOIN ${CART_TABLE.NAME} ON ${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.ID}=${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.CART} WHERE ${CART_TABLE.NAME}.${CART_TABLE.COLUMNS.USER} = ? AND ${CARTITEM_TABLE.NAME}.${CARTITEM_TABLE.COLUMNS.ITEM} IN (?)`;
            const deleteFromCartColumnValues = [order.user.id, itemIds]
            return dbUtil.query(result.connection, deleteFromCartQuery, deleteFromCartColumnValues);
        }).then(function(result) {
            const selectInsertedOrder = `SELECT * FROM ${ORDER_TABLE.NAME} WHERE ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.ID} = ?`;
            return dbUtil.query(result.connection, selectInsertedOrder, orderInsertionColumnValues[ORDER_TABLE.COLUMNS.ID]);
        }).then(function (result) {
            return dbUtil.commitTransaction(result.connection, result.results);
        }).then(function(results) {
            const result = results[0];
            return new OrderModel(result[ORDER_TABLE.COLUMNS.ID], AppUtil.getLocaleDateString(result[ORDER_TABLE.COLUMNS.DATE]), null, null, result[ORDER_TABLE.COLUMNS.STATUS], null);
        });
    }

}

module.exports = UserOrderHandler;