const OutletModel = require("../models/OutletModel");
const AddressModel = require("../models/AddressModel");
const RestaurantModel = require("../models/RestaurantModel");

const DBUtil = require("../utils/DBUtil");

const OUTLET_TABLE = require('../tables/OutletTable');
const ADDRESS_TABLE = require('../tables/AddressTable');
const RESTAURANT_TABLE = require('../tables/RestaurantTable');

class OutletHandler {
    constructor() {
    }

    fetchAll(restaurant /* : RestaurantModel */) {
        if (restaurant && restaurant.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${OUTLET_TABLE.NAME} LEFT JOIN ${ADDRESS_TABLE.NAME} ON ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.ADDRESS} = ${ADDRESS_TABLE.NAME}.${ADDRESS_TABLE.COLUMNS.ID} LEFT JOIN  ${RESTAURANT_TABLE.NAME} ON ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.RESTAURANT} = ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.ID} WHERE ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.RESTAURANT} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, restaurant.id);
            }).then(function (result) {
                return result.results.map(function (result, index, arr) {
                    const address = new AddressModel(
                        result[OUTLET_TABLE.COLUMNS.ADDRESS],
                        result[ADDRESS_TABLE.COLUMNS.LINE1],
                        result[ADDRESS_TABLE.COLUMNS.LINE2],
                        result[ADDRESS_TABLE.COLUMNS.CITY],
                        result[ADDRESS_TABLE.COLUMNS.STATE],
                        result[ADDRESS_TABLE.COLUMNS.ZIPCODE]);
                    const restaurant = new RestaurantModel(
                        result[OUTLET_TABLE.COLUMNS.RESTAURANT],
                        result[RESTAURANT_TABLE.COLUMNS.NAME], null, null, null);

                    const outlet = new OutletModel(
                        String(result[OUTLET_TABLE.COLUMNS.ID]),
                        result[OUTLET_TABLE.COLUMNS.NAME],
                        address,
                        result[OUTLET_TABLE.COLUMNS.CONTACT],
                        restaurant);
                    return outlet;
                });
            });
        }
        throw new Error('Error: Cannot GET all outlets.');
    }

    fetch(outlet /* : OutletModel */) {
        if (outlet && outlet.id && outlet.restaurant && outlet.restaurant.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${OUTLET_TABLE.NAME} LEFT JOIN ${ADDRESS_TABLE.NAME} ON ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.ADDRESS} = ${ADDRESS_TABLE.NAME}.${ADDRESS_TABLE.COLUMNS.ID} LEFT JOIN  ${RESTAURANT_TABLE.NAME} ON ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.RESTAURANT} = ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.ID} WHERE ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.ID} = ? AND ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.RESTAURANT} = ?`
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.query(connection, selectQuery, [outlet.id, outlet.restaurant.id]);
            }).then(function (result) {
                return result.results.map(function (result, index, arr) {
                    const address = new AddressModel(
                        result[OUTLET_TABLE.COLUMNS.ADDRESS],
                        result[ADDRESS_TABLE.COLUMNS.LINE1],
                        result[ADDRESS_TABLE.COLUMNS.LINE2],
                        result[ADDRESS_TABLE.COLUMNS.CITY],
                        result[ADDRESS_TABLE.COLUMNS.STATE],
                        result[ADDRESS_TABLE.COLUMNS.ZIPCODE]);
                    const restaurant = new RestaurantModel(
                        result[OUTLET_TABLE.COLUMNS.RESTAURANT],
                        result[RESTAURANT_TABLE.COLUMNS.NAME], null, null, null);

                    const outlet = new OutletModel(
                        String(result[OUTLET_TABLE.COLUMNS.ID]),
                        result[OUTLET_TABLE.COLUMNS.NAME],
                        address,
                        result[OUTLET_TABLE.COLUMNS.CONTACT],
                        restaurant);
                    return outlet;
                })[0];
            });
        }
        throw new Error('Error: Cannot GET outlet.');
    }

    insert(outlet /* : OutletModel */) {
        const dbUtil = new DBUtil();

        // insert address and then insert outlet.
        const addressInsertQuery = `INSERT INTO ${ADDRESS_TABLE.NAME} SET ?`;
        const addressColumnValues = {
            [ADDRESS_TABLE.COLUMNS.LINE1]: outlet.address.lineOne,
            [ADDRESS_TABLE.COLUMNS.LINE2]: outlet.address.lineTwo,
            [ADDRESS_TABLE.COLUMNS.CITY]: outlet.address.city,
            [ADDRESS_TABLE.COLUMNS.STATE]: outlet.address.state,
            [ADDRESS_TABLE.COLUMNS.ZIPCODE]: outlet.address.zipcode
        };

        const outletInsertQuery = `INSERT INTO ${OUTLET_TABLE.NAME} SET ?`;
        let outletColumnValues = {
            [OUTLET_TABLE.COLUMNS.NAME]: outlet.name,
            [OUTLET_TABLE.COLUMNS.CONTACT]: outlet.contact,
            [OUTLET_TABLE.COLUMNS.RESTAURANT]: outlet.restaurant.id
        };
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
        }).then(function (connection) {
            return dbUtil.query(connection, addressInsertQuery, addressColumnValues);
        }).then(function (result) {
            outletColumnValues[OUTLET_TABLE.COLUMNS.ADDRESS] = String(result.results.insertId);
            return dbUtil.query(result.connection, outletInsertQuery, outletColumnValues);
        }).then(function (result) {
            const address = new AddressModel(
                outletColumnValues[OUTLET_TABLE.COLUMNS.ADDRESS],
                outlet.address.lineOne,
                outlet.address.lineTwo,
                outlet.address.city,
                outlet.address.state,
                outlet.address.zipcode);

            const insertedOutlet = new OutletModel(
                result.results.insertId.toString(),
                outlet.name,
                address,
                outlet.contact,
                outlet.restaurant);
            return {
                connection: result.connection,
                result: insertedOutlet
            }
        }).then(function (result) {
            return dbUtil.commitTransaction(result.connection, result.result);
        });
    }

    update(outlet /* : OutletModel */) {
        if (!outlet || !outlet.id || !outlet.restaurant || !outlet.restaurant.id) {
            throw new Error("Insufficient input.");
        }
        const dbUtil = new DBUtil();
        const addressUpdateQuery = `UPDATE ${ADDRESS_TABLE.NAME} SET ${ADDRESS_TABLE.COLUMNS.LINE1} = ? , ${ADDRESS_TABLE.COLUMNS.LINE2} = ?, ${ADDRESS_TABLE.COLUMNS.CITY} = ?, ${ADDRESS_TABLE.COLUMNS.STATE} = ?, ${ADDRESS_TABLE.COLUMNS.ZIPCODE} = ? WHERE ${ADDRESS_TABLE.COLUMNS.ID} = ?`;
        const addressColumnValues = [
            outlet.address.lineOne,
            outlet.address.lineTwo,
            outlet.address.city,
            outlet.address.state,
            outlet.address.zipcode,
            outlet.address.id
        ];

        const outletUpdateQuery = `UPDATE ${OUTLET_TABLE.NAME} SET ${OUTLET_TABLE.COLUMNS.NAME} = ?, ${OUTLET_TABLE.COLUMNS.CONTACT} = ? WHERE ${OUTLET_TABLE.COLUMNS.ID} = ? AND ${OUTLET_TABLE.COLUMNS.RESTAURANT} = ?`;
        const outletColumnValues = [
            outlet.name,
            outlet.contact,
            outlet.id,
            outlet.restaurant.id
        ];

        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
        }).then(function (connection) {
            return dbUtil.query(connection, outletUpdateQuery, outletColumnValues);
        }).then(function (result) {
            if (result.results.affectedRows === 0) {
                return dbUtil.rollbackTransaction(result.connection).then(function () {
                    throw Error("Unauthorized update.");
                });
            }
            return dbUtil.query(result.connection, addressUpdateQuery, addressColumnValues);
        }).then(function (result) {
            return {
                connection: result.connection,
                result: outlet
            }
        }).then(function (result) {
            return dbUtil.commitTransaction(result.connection, result.result);
        });
    }

    delete(outlet /* : OutletMode */) {
        const dbUtil = new DBUtil();
        const deleteQuery = `DELETE FROM ${OUTLET_TABLE.NAME} WHERE ${OUTLET_TABLE.COLUMNS.ID} = ? AND ${OUTLET_TABLE.COLUMNS.RESTAURANT} = ?`
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, deleteQuery, [outlet.id, outlet.restaurant.id]);
        }).then(function (result) {
            if (result.results.affectedRows === 0) {
                throw new Error("Unauthorized delete.");
            }
        });
    }
}

module.exports = OutletHandler;