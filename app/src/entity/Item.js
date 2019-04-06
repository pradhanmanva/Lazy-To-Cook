let mysql = require("mysql");
let conn = require("./Connection.js");

class Item {
    constructor(item_id, item_name, description, price, category_id) {
        this.con = new conn();
        this.item_id = item_id;
        this.item_name = item_name;
        this.description = description;
        this.price = price;
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
        return [this.item_id, this.item_name, this.description, this.price, this.category_id];
    }

}

// let obj = new Item(1, 'name', 'desp', 4, 3);
// obj.getAll();
// obj.insert();