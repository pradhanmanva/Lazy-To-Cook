const DBUtil = require('../utils/DBUtil');

const UserModel = require('../models/UserModel');
const AddressModel = require('../models/AddressModel');

const USER_TABLE = require('../tables/UserTable');
const ADDRESS_TABLE = require('../tables/AddressTable');
const USER_AUTH_TABLE = require('../tables/UserAuthenticationTable');
const CART_TABLE = require('../tables/CartTable');

const bcrypt = require('bcrypt');

class UserHandler {
    constructor() {
    }

    register(authCredentials /* : UserAuthenticationModel */) {
        const user = authCredentials.user;
        const dbUtil = new DBUtil();
        const authenticationInsertQuery = `INSERT INTO ${USER_AUTH_TABLE.NAME} SET ?`;
        let authenticationColumnValues = {
            [USER_AUTH_TABLE.COLUMNS.PASSWORD]: authCredentials.password
        };
        const insertQuery = `INSERT INTO ${USER_TABLE.NAME} SET ?`;
        let columnValues = {
            [USER_TABLE.COLUMNS.FIRSTNAME]: user.firstName,
            [USER_TABLE.COLUMNS.LASTNAME]: user.lastName,
            [USER_TABLE.COLUMNS.MIDDLENAME]: user.middleName,
            [USER_TABLE.COLUMNS.DOB]: user.dateOfBirth,
            [USER_TABLE.COLUMNS.EMAIL]: user.email
        };

        const addressInsertQuery = `INSERT INTO ${ADDRESS_TABLE.NAME} SET ?`;
        const addressColumnValues = {
            [ADDRESS_TABLE.COLUMNS.LINE1]: user.address.lineOne,
            [ADDRESS_TABLE.COLUMNS.LINE2]: user.address.lineTwo,
            [ADDRESS_TABLE.COLUMNS.CITY]: user.address.city,
            [ADDRESS_TABLE.COLUMNS.STATE]: user.address.state,
            [ADDRESS_TABLE.COLUMNS.ZIPCODE]: user.address.zipcode
        };

        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
        }).then(function (connection) {
            return dbUtil.query(connection, addressInsertQuery, addressColumnValues);
        }).then(function (result) {
            columnValues[USER_TABLE.COLUMNS.ADDRESS] = String(result.results.insertId);
            return dbUtil.query(result.connection, insertQuery, columnValues);
        }).then(function (result) {
            authenticationColumnValues[USER_TABLE.COLUMNS.ID] = String(result.results.insertId);
            return dbUtil.query(result.connection, authenticationInsertQuery, authenticationColumnValues);
        }).then(function (result) {
            const createCartQuery = `INSERT INTO ${CART_TABLE.NAME} SET ?`;
            const cartColumnValues = {
                [CART_TABLE.COLUMNS.NAME] : `cart_${authenticationColumnValues[USER_TABLE.COLUMNS.ID]}`,
                [CART_TABLE.COLUMNS.USER] : authenticationColumnValues[USER_TABLE.COLUMNS.ID]
            }
            return dbUtil.query(result.connection, createCartQuery, cartColumnValues);
        }).then(function (result) {
            return dbUtil.commitTransaction(result.connection, result.results);
        }).then(function () {
            user.id = authenticationColumnValues[USER_TABLE.COLUMNS.ID];
            user.address.id = columnValues[USER_TABLE.COLUMNS.ADDRESS];
            return user;
        });
    }

    validate(authCredentials /* : UserAuthenticationModel */) {
        if (authCredentials && authCredentials.user.email && authCredentials.password) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT ${USER_AUTH_TABLE.NAME}.${USER_AUTH_TABLE.COLUMNS.ID}, ${USER_AUTH_TABLE.NAME}.${USER_AUTH_TABLE.COLUMNS.PASSWORD} FROM ${USER_AUTH_TABLE.NAME} INNER JOIN ${USER_TABLE.NAME} ON ${USER_AUTH_TABLE.NAME}.${USER_AUTH_TABLE.COLUMNS.ID}=${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID} WHERE ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.EMAIL} = ?`;
            return dbUtil.getConnection().then(function (connection) {
                if (!connection) {
                    throw Error('connection not available.');
                }
                return dbUtil.beginTransaction(connection);
            }).then(function(connection){
                return dbUtil.query(connection, selectQuery, authCredentials.user.email);
            }).then(function (result) {
                return dbUtil.commitTransaction(result.connection, result.results);
            }).then(function (result) {
                if (result && result && result.length && bcrypt.compareSync(authCredentials.password, result[0][USER_AUTH_TABLE.COLUMNS.PASSWORD])) {
                    return result[0][USER_AUTH_TABLE.COLUMNS.ID].toString();
                }
                throw new Error("Invalid credentials.");
            });
        }
        throw new Error('Insufficient data to validate.');
    }

    fetch(user /* :UserModel*/) {
        if (user && user.id) {
            const dbUtil = new DBUtil();
            const selectQuery = `SELECT * FROM ${USER_TABLE.NAME} INNER JOIN ${ADDRESS_TABLE.NAME} ON ${ADDRESS_TABLE.NAME}.${ADDRESS_TABLE.COLUMNS.ID} = ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ADDRESS} WHERE ${USER_TABLE.COLUMNS.ID} = ?`;
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
                    const address = new AddressModel(result[ADDRESS_TABLE.COLUMNS.ID], result[ADDRESS_TABLE.COLUMNS.LINE1], result[ADDRESS_TABLE.COLUMNS.LINE2], result[ADDRESS_TABLE.COLUMNS.CITY], result[ADDRESS_TABLE.COLUMNS.STATE], result[ADDRESS_TABLE.COLUMNS.ZIPCODE]); 
                    return new UserModel(String(result[USER_TABLE.COLUMNS.ID]), result[USER_TABLE.COLUMNS.FIRSTNAME], result[USER_TABLE.COLUMNS.MIDDLENAME], result[USER_TABLE.COLUMNS.LASTNAME], result[USER_TABLE.COLUMNS.DOB], result[USER_TABLE.COLUMNS.EMAIL], address, result[USER_TABLE.COLUMNS.IS_DELETED]);
                })[0];
            });
        }
        throw new Error('Invalid Operation: Cannot GET all users.');
    }


    delete(user) {
        const dbUtil = new DBUtil();
        const deleteQuery = `UPDATE ${USER_TABLE.NAME} SET ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.IS_DELETED} = true WHERE ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID} = ?`;
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, deleteQuery, user.id);
        }).then(function(result){
            dbUtil.releaseConnection(result.connection);
        });
    }

    update(user /* : UserModel */) {
        if (!user || !user.id) {
            throw new Error("Insufficient input.");
        }
        const dbUtil = new DBUtil();

        const updateQuery = `UPDATE ${USER_TABLE.NAME} INNER JOIN ${ADDRESS_TABLE.NAME} ON ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ADDRESS}=${ADDRESS_TABLE.NAME}.${ADDRESS_TABLE.COLUMNS.ID} SET ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ADDRESS}=${ADDRESS_TABLE.NAME}.${ADDRESS_TABLE.COLUMNS.ID}, ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.FIRSTNAME} = ?, ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.MIDDLENAME} = ?, ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.LASTNAME} = ?, ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.DOB} = ?, ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.EMAIL} = ?, ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.IS_DELETED} = false, ${ADDRESS_TABLE.NAME}.${ADDRESS_TABLE.COLUMNS.LINE1} = ?, ${ADDRESS_TABLE.NAME}.${ADDRESS_TABLE.COLUMNS.LINE2} = ?, ${ADDRESS_TABLE.NAME}.${ADDRESS_TABLE.COLUMNS.CITY} = ?, ${ADDRESS_TABLE.NAME}.${ADDRESS_TABLE.COLUMNS.STATE} = ?, ${ADDRESS_TABLE.NAME}.${ADDRESS_TABLE.COLUMNS.ZIPCODE} = ? WHERE ${USER_TABLE.NAME}.${USER_TABLE.COLUMNS.ID} = ?`;
        const columnValues = [
            user.firstName,
            user.middleName,
            user.lastName,
            user.dateOfBirth,
            user.email,
            user.address.lineOne,
            user.address.lineTwo,
            user.address.city,
            user.address.state,
            user.address.zipcode,
            user.id
        ];

        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.beginTransaction(connection);
        }).then(function (connection) {
            return dbUtil.query(connection, updateQuery, columnValues);
        })
        .then(function (result) {
            return {
                connection: result.connection,
                result: user
            }
        }).then(function (result) {
            return dbUtil.commitTransaction(result.connection, result.result);
        });
    }
}

module.exports = UserHandler;