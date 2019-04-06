let mysql = require("mysql");
let conn = require("./Connection.js");

class Category {
    constructor(category_id, category_name, restaurant_id) {
        this.con = new conn();
        this.tableName = 'category';
        this.category_id = category_id;
        this.category_name = category_name;
        this.restaurant_id = restaurant_id;
    }

    getAll() {
        this.con.getAll(this.tableName);
    }

    get(whereConditions, orderBy = 'category_id', ascending = true) {
        this.con.get(this.tableName, whereConditions, orderBy, ascending);
    }

    insert() {
        this.con.insert(this.tableName, this.toArray());
    }

    toArray() {
        return [this.category_id, this.category_name, this.restaurant_id];
    }

}


// let obj = new Category(1, 1, 1);
// obj.getAll();
// obj.insert();