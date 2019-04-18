const DBUtil = require('../utils/DBUtil');

const USER_TABLE = require('../tables/UserTable');
const ADDRESS_TABLE = require('../tables/AddressTable');
const USER_AUTH_TABLE = require('../tables/UserAuthenticationTable');

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
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, addressInsertQuery, addressColumnValues);
        }).then(function (result) {
            columnValues[USER_TABLE.COLUMNS.ADDRESS] = String(result.results.insertId);
            return dbUtil.query(result.connection, insertQuery, columnValues);
        }).then(function (result) {
            authenticationColumnValues[USER_TABLE.COLUMNS.ID] = String(result.results.insertId);
            return dbUtil.query(result.connection, authenticationInsertQuery, authenticationColumnValues);
        }).then(function (result) {
            return dbUtil.commitTransaction(result.connection, result.results);
        }).then(function (result) {
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
                return dbUtil.query(connection, selectQuery, authCredentials.user.email);
            }).then(function (result) {
                if (result && result.results && result.results.length && bcrypt.compareSync(authCredentials.password, result.results[0][USER_AUTH_TABLE.COLUMNS.PASSWORD])) {
                    return result.results[0][USER_AUTH_TABLE.COLUMNS.ID].toString();
                }
                throw new Error("Invalid credentials.");
            });
        }
        throw new Error('Insufficient data to validate.');
    }


}

module.exports = UserHandler;