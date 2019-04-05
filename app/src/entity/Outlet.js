let conn = require("./Connection.js");

class Outlet {
    constructor(outlet_id, outlet_name, outlet_address, outlet_contact, restaurant_id) {
        this.con = new conn();
        this.tableName = 'restaurant';
        this.outlet_id = outlet_id;
        this.outlet_name = outlet_name;
        this.outlet_contact = outlet_contact;
        this.outlet_address = outlet_address;
        this.restaurant_id = restaurant_id;
    }

    getAll() {
        this.con.getAll(this.tableName);
    }

    get(whereConditions, orderBy = 'outlet_id', ascending = true) {
        this.con.get(this.tableName, whereConditions, orderBy, ascending);
    }

    insert() {
        this.con.insert(this.tableName, this.toArray());
    }

    toArray() {
        return [this.outlet_id, this.outlet_name, this.outlet_address, this.outlet_contact, this.restaurant_id];
    }

}

let obj = new Outlet(1, 'Subway Richardson', '515 W Campbell Rd #109, Richardson, TX 75080', 726428, 4);
// obj.getAll();
// obj.get(['restaurant_id', 2]);
obj.insert();