let mysql = require("mysql");

class Connection {
    constructor() {
        this.con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            port: 8889,
            database: 'lazytocook'
        });
        this.con.connect(function (error) {
            if (error) throw error;
            console.log("connected");
        });
        return this;
    }

    getAll(tableName) {
        let sql = 'SELECT * FROM ??';
        sql = mysql.format(sql, tableName);
        this.con.query(sql, function (error, result, fields) {
            if (error) throw error;
            console.log(result);
            console.log(fields)
        });
    }

    get(tableName, whereConditions, orderBy, ascending = true) {
        if (whereConditions.length === 0) {
            this.getAll(tableName);
            return;
        }

        let sql = 'SELECT * FROM ?? WHERE ';
        sql += '??=? and'.repeat(whereConditions.length / 2);
        sql = sql.substring(0, sql.length - 4);
        whereConditions.unshift(tableName);

        if (!isNaN(orderBy)) {
            sql += ' order by ??';
            if (!ascending) {
                sql += " desc"
            }
            whereConditions.push(orderBy);
        }
        sql = mysql.format(sql, whereConditions);

        this.con.query(sql, function (error, result, fields) {
            if (error) throw error;
            console.log(result);
            console.log(fields);
        });
    }

    insert(tableName, values) {
        if (values.length === 0) {
            throw error;
        }
        let sql = 'INSERT INTO ?? VALUES (' + '?,'.repeat(values.length - 1) + '?)';
        values.unshift(tableName);
        sql = mysql.format(sql, values);
        console.log(sql);
        this.con.query(sql, function (error, result, fields) {
            if (error) throw error;
            console.log(result);
            console.log(fields);
        });
    }
}

module.exports = Connection;
// let obj = new Connection();
// obj.getAll('restaurant');
// obj.get('restaurant', ['restaurant_id', 5,], 'email');
// obj.insert('restaurant', [8, 'Jack in the box', 54768, 'order@jackinthebox.com', 'www.jackinthebox.com']);