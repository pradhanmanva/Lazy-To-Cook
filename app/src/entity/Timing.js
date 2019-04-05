let mysql = require("mysql");

class Timing {
    constructor(timing_id, outlet_id, day, start_hour, end_hour) {
        let conn = require("./Connection.js");
        this.con = new conn();
        this.con.connect(function (err) {
            if (err) throw err;
            console.log("connected");
        });

        this.timing_id = timing_id;
        this.outlet_id = outlet_id;
        this.day = day;
        this.start_hour = start_hour;
        this.end_hour = end_hour;
    }

    getAll() {

    }

    get(where_conditions, orderby = 'timing_id', ascending = true) {

    }

    insert() {

    }
}


let obj = new Timing(1, 2, 3, 4, 5);
// obj.get(['start_hour', 4, 'end_hour', 6, 'day', "'monday'"]);
// obj.insert();