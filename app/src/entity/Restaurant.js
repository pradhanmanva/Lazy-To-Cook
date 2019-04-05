var mysql = require("mysql");

class Restaurant {
    constructor(restaurant_id, restaurant_name, contact, email, website) {
        let conn = require("./Connection.js");
        this.con = new conn();

        this.restaurant_id = restaurant_id;
        this.restaurant_name = restaurant_name;
        this.contact = contact;
        this.email = email;
        this.website = website;
    }

    getAll() {
        let self = this;
        self.con.connect(function (err) {
            if (err) throw err;

            console.log("connected");
            let sql = 'SELECT * FROM `restaurant`';

            self.con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
            });
        });
    }

    get(where_conditions, orderby = 'restaurant_id', ascending = true) {
        let self = this;
        if (where_conditions.length === 0) {
            this.getAll();
            return;
        }
        self.con.connect(function (err) {
            if (err) throw err;

            console.log("connected");
            let sql = 'SELECT * FROM restaurant WHERE ';
            let i = 1;
            while (i <= where_conditions.length / 2) {
                sql += "??=? and ";
                i++;
            }
            sql = sql.substring(0, sql.length - 4);
            sql = mysql.format(sql, where_conditions);
            self.con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
            });
        });
    }
}

let obj = new Restaurant();
obj.getAll();
obj.get(['restaurant_id', 2]);