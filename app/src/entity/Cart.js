let mysql = require("mysql");
let conn = require("./Connection.js");

class Cart {
    constructor(cart_id, cart_name, user_id) {
        this.con = new conn();
        this.tableName = 'cart';
        this.cart_id = cart_id;
        this.cart_name = cart_name;
        this.user_id = user_id;
    }

    getAll() {
        this.con.getAll(this.tableName);
    }

    get(whereConditions, orderBy = 'cart_id', ascending = true) {
        this.con.get(this.tableName, whereConditions, orderBy, ascending);
    }

    insert() {
        this.con.insert(this.tableName, this.toArray());
    }

    toArray() {
        return [this.cart_id, this.cart_name, this.user_id];
    }

}


// let obj = new Cart();
// obj.getAll();
// obj.insert();