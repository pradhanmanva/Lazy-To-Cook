const OutletModel = require("../models/OutletModel");
const UserModel = require("../models/UserModel");
const ItemModel = require("../models/ItemModel");
const RestaurantOrderModel = require("../models/OrderModel");
const RestaurantOrderItemModel = require("../models/OrderItemModel");

const DBUtil = require("../utils/DBUtil");

const OUTLET_TABLE = require('../tables/OutletTable');
const ADDRESS_TABLE = require('../tables/AddressTable');
const USER_TABLE = require('../tables/UserTable');
const RESTAURANT_TABLE = require('../tables/RestaurantTable');
const ORDER_TABLE = require("../tables/OrderTable");
const ORDERITEM_TABLE = require("../tables/OrderItemTable");

const ORDER_STATUS = require("../models/OrderStatus");

class RestaurantOrderHandler {
    constructor() {
    }

    fetchAll(restaurant /* : RestaurantModel */) {
        if (restaurant && restaurant.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${ORDER_TABLE.NAME} INNER JOIN ${OUTLET_TABLE.NAME} ON ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.ID} = ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.OUTLET} INNER JOIN ${USER_TABLE.NAME} ON ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID}=${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.USER} WHERE ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.RESTAURANT} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.beginTransaction(connection);
            }).then(function(connection) {
                return dbUtil.query(connection, selectQuery, restaurant.id);
            }).then(function(result) {
                return dbUtil.commitTransaction(result.connection, result.results);
            }).then(function (result) {
                return result.map(function (result, index, arr) {
                    const restaurantOrderModel = new RestaurantOrderModel(
                                result[ORDER_TABLE.COLUMNS.ID],
                                result[ORDER_TABLE.COLUMNS.DATE],
                                new UserModel(result[ORDER_TABLE.COLUMNS.USER],result[USER_TABLE.COLUMNS.FIRSTNAME], result[USER_TABLE.COLUMNS.MIDDLENAME], result[USER_TABLE.COLUMNS.LASTNAME], null, null, null, null),
                                new OutletModel(result[ORDER_TABLE.COLUMNS.OUTLET], result[OUTLET_TABLE.COLUMNS.NAME], null, null, null),
                                result[ORDER_TABLE.COLUMNS.STATUS]);
                    return restaurantOrderModel;
                });
            });
        }
        throw new Error('Error: Cannot GET all orders.');
    }

    fetch(order /* : OrderModel */, restaurant /* RestaurantModel */) {
        if (order && order.id && restaurant && restaurant.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${ORDER_TABLE.NAME} INNER JOIN ${ORDERITEM_TABLE.NAME} ON ${ORDERITEM_TABLE.NAME}.${ORDERITEM_TABLE.COLUMNS.ID}=${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.ID} INNER JOIN ${OUTLET_TABLE.NAME} ON ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.ID} = ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.OUTLET} INNER JOIN ${USER_TABLE.NAME} ON ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID}=${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.USER} WHERE ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.RESTAURANT} = ? AND ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.ID} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.beginTransaction(connection);
            }).then(function(connection) {
                return dbUtil.query(connection, selectQuery, [restaurant.id, order.id]);
            }).then(function(result) {
                return dbUtil.commitTransaction(result.connection, result.results);
            }).then(function (result) {
                const item = result[0];
                const restaurantOrderModel = new RestaurantOrderModel(
                    item[ORDER_TABLE.COLUMNS.ID],
                    item[ORDER_TABLE.COLUMNS.DATE],
                    new UserModel(item[ORDER_TABLE.COLUMNS.USER],item[USER_TABLE.COLUMNS.FIRSTNAME], item[USER_TABLE.COLUMNS.MIDDLENAME], item[USER_TABLE.COLUMNS.LASTNAME], null, null, null, null),
                    new OutletModel(item[ORDER_TABLE.COLUMNS.OUTLET], item[OUTLET_TABLE.COLUMNS.NAME], null, null, null),
                    item[ORDER_TABLE.COLUMNS.STATUS],
                    result.map(function (item, index, arr) {
                        const restaurantOrderItemModel = new RestaurantOrderItemModel(
                            new ItemModel(null, item[ORDERITEM_TABLE.COLUMNS.ITEMNAME], item[ORDERITEM_TABLE.COLUMNS.DESCRIPTION], item[ORDERITEM_TABLE.COLUMNS.PRICE], null, null),
                            item[ORDERITEM_TABLE.COLUMNS.QUANTITY]);
                        return restaurantOrderItemModel.toJSON();
                    }));
                return restaurantOrderModel;
            });
        }
        throw new Error('Error: Cannot GET order.');
    }

    update(order /* : OrderModel */, restaurant /* : RestaurantModel */) {
        if (!order || !order.id || !restaurant || !restaurant.id || !order.status) {
            throw new Error("Insufficient input.");
        }
        const dbUtil = new DBUtil();
        const orderUpdateQuery = `UPDATE ${ORDER_TABLE.NAME} SET ${ORDER_TABLE.COLUMNS.STATUS} = ? WHERE ${ORDER_TABLE.COLUMNS.ID} = ?`;
        const orderColumnValues = [
            order.status,
            order.id
        ];

        const prevState = {
            [ORDER_STATUS.ACCEPTED] : ORDER_STATUS.RECEIVED,
            [ORDER_STATUS.READY] : ORDER_STATUS.ACCEPTED,
            [ORDER_STATUS.OUT_FOR_DELIVERY] : ORDER_STATUS.READY,
            [ORDER_STATUS.DELIVERED] : ORDER_STATUS.OUT_FOR_DELIVERY
        }

        const validationQuery = `SELECT * FROM ${ORDER_TABLE.NAME} INNER JOIN ${OUTLET_TABLE.NAME} ON ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.ID} = ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.OUTLET} WHERE ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.RESTAURANT} = ? AND ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.ID} = ? AND ${ORDER_TABLE.NAME}.${ORDER_TABLE.COLUMNS.STATUS} = ?`;
        const validationColumnValues = [restaurant.id, order.id, prevState[order.status]];
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
        }).then(function (connection) {
            return dbUtil.query(connection, validationQuery, validationColumnValues);
        }).then(function (result) {
            if (!result.results || result.results.length === 0) {
                return dbUtil.rollbackTransaction(result.connection).then(function () {
                    return Promise.reject(new Error(`Invalid Operation: Either no order does not belong to restaurant or the order is not in ${prevState[order.status]} stage.`));
                });
            } else {
                return dbUtil.query(result.connection, orderUpdateQuery, orderColumnValues);
            }
        }).then(function (result) {
            return {
                connection: result.connection,
                result: order
            }
        }).then(function (result) {
            return dbUtil.commitTransaction(result.connection, result.result);
        });
    }

}

module.exports = RestaurantOrderHandler;