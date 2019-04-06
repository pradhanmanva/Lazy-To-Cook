let mysql = require("mysql");
let conn = require("./Connection.js");

class CartItem {
    constructor(cart_id, item_id, quantity) {
        this.con = new conn();
        this.tableName = 'cart_item';
        this.cart_id = cart_id;
        this.item_id = item_id;
        this.quantity = quantity;
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
        return [this.cart_id, this.item_id, this.quantity];
    }

}


// let obj = new CartItem(1, 1, 1);
// obj.getAll();
// obj.insert();