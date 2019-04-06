let mysql = require("mysql");
let conn = require("./Connection.js");

class ItemOutlet {
    constructor(item_id, outlet_id) {
        this.con = new conn();
        this.item_id = item_id;
        this.category_id = category_id;
    }

    getAll() {
        this.con.getAll(this.tableName);
    }

    get(whereConditions, orderBy = 'item_id', ascending = true) {
        this.con.get(this.tableName, whereConditions, orderBy, ascending);
    }

    insert() {
        this.con.insert(this.tableName, this.toArray());
    }

    toArray() {
        return [this.item_id, this.outlet_id];
    }

}

// let obj = new ItemOutlet(1, 3);
// obj.getAll();
// obj.insert();