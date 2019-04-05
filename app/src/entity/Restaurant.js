let conn = require("./Connection.js");

class Restaurant {
    constructor(restaurant_id, restaurant_name, contact, email, website) {
        this.con = new conn();
        this.tableName = 'restaurant';
        this.restaurant_id = restaurant_id;
        this.restaurant_name = restaurant_name;
        this.contact = contact;
        this.email = email;
        this.website = website;
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
        return [this.restaurant_id, this.restaurant_name, this.contact, this.email, this.website];
    }

}

// let obj = new Restaurant(9, 'Panda Express', 64960, 'order@pandaexpress.com', 'www.pandaexpress.com');
// obj.getAll();
// obj.get(['restaurant_id', 2]);
// obj.insert();