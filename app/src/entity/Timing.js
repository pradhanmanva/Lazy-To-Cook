let mysql = require("mysql");
let conn = require("./Connection.js");

class Timing {
    constructor(timing_id, outlet_id, day, start_hour, end_hour) {
        this.con = new conn();
        this.tableName = 'timing';
        this.timing_id = timing_id;
        this.outlet_id = outlet_id;
        this.day = day;
        this.start_hour = start_hour;
        this.end_hour = end_hour;
    }

    getAll() {
        this.con.getAll(this.tableName);
    }

    get(whereConditions, orderBy = 'timing_id', ascending = true) {
        this.con.get(this.tableName, whereConditions, orderBy, ascending);
    }

    insert() {
        this.con.insert(this.tableName, this.toArray());
    }

    toArray() {
        return [this.timing_id, this.outlet_id, this.day, this.start_hour, this.end_hour];
    }

}


// let obj = new Timing(1, 2, 3, 4, 5);
// obj.get(['start_hour', 4, 'end_hour', 6, 'day', "'monday'"]);
// obj.insert();