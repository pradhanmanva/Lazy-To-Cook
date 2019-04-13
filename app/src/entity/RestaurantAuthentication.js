let conn = require("./Connection.js");

class RestaurantAuthentication {
    constructor(restaurant_id, username, password) {
        this.con = new conn();
        this.restaurant_id = restaurant_id;
        this.username = username;
        this.password = password;
    }

    getAll() {
        this.con.getAll(this.tableName);
    }

    get(whereConditions, orderBy = 'restaurant_id', ascending = true) {
        this.con.get(this.tableName, whereConditions, orderBy, ascending);
    }

    insert() {
        this.con.insert(this.tableName, this.toArray());
    }

    toArray() {
        return [this.restaurant_id, this.username, this.password];
    }

}

let obj = new RestaurantAuthentication(1, '23', '3');
obj.getAll();
// obj.insert();