var mysql = require("mysql");

class Timing {
    constructor(timing_id, outlet_id, day, start_hour, end_hour) {
        let conn = require("./Connection.js");
        this.con = new conn();

        this.timing_id = timing_id;
        this.outlet_id = outlet_id;
        this.day = day;
        this.start_hour = start_hour;
        this.end_hour = end_hour;
    }

    getAll() {
        let self = this;
        this.con.connect(function (err) {
            if (err) throw err;

            console.log("connected");
            let sql = 'SELECT * FROM `timing`';

            self.con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
            });
        });
    }

    get(where_conditions, orderby = 'timing_id', ascending = true) {
        let self = this;
        if (where_conditions.length === 0) {
            this.getAll();
            return;
        }
        self.con.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            let sql = 'SELECT * FROM timing WHERE ';
            let i = 1;
            while (i++ <= where_conditions.length / 2) {
                sql += "??=? and ";
            }
            sql = sql.substring(0, sql.length - 4);
            sql = mysql.format(sql, where_conditions);
            self.con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
            });
        });
    }

    insert() {
        let self = this;
        self.con.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            let sql = 'INSERT INTO timing VALUES (?,?,?,?,?)';
            sql = mysql.format(sql, [self.timing_id, self.outlet_id, self.start_hour, self.end_hour, self.day]);
            console.log(sql);
            self.con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
            });
        });
    }
}


var obj = new Timing(1, 2, 3, 4, 5);
obj.get(['start_hour', 4, 'end_hour', 6, 'day', "'monday'"]);
// obj.insert();