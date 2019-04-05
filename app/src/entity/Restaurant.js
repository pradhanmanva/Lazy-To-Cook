var mysql = require("mysql");

class Restaurant {
    constructor(restaurant_id, restaurant_name, contact, email, website) {
        let conn = require("./Connection.js");
        this.con = new conn();
        this.con.connect(function (err) {
            if (err) throw err;
            console.log("connected");
        });
        this.restaurant_id = restaurant_id;
        this.restaurant_name = restaurant_name;
        this.contact = contact;
        this.email = email;
        this.website = website;
    }

    getAll() {
        let sql = 'SELECT * FROM `restaurant`';
        this.con.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    }

    get(where_conditions, orderby = 'restaurant_id', ascending = true) {
        if (where_conditions.length === 0) {
            this.getAll();
            return;
        }
        let sql = 'SELECT * FROM restaurant WHERE ';
        let i = 1;
        while (i++ <= where_conditions.length / 2) {
            sql += "??=? and ";
        }
        sql = sql.substring(0, sql.length - 4);
        sql = mysql.format(sql, where_conditions);
        this.con.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    }

    insert() {
        let sql = 'INSERT INTO restaurant VALUES (?,?,?,?,?)';
        sql = mysql.format(sql, [this.restaurant_id, this.restaurant_name, this.contact, this.email, this.website]);
        console.log(sql);
        this.con.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    }
}

let obj = new Restaurant(6, 'Domino\'s', 36978, 'order@dominos.com', 'www.dominos.com');
// obj.getAll();
// obj.get(['restaurant_id', 2]);
obj.insert();