let mysql = require("mysql");
let conn = require("./Connection.js");

class Address {
    constructor(address_id, line_1, line_2, city, state, zipcode) {
        this.con = new conn();
        this.tableName = 'address';
        this.address_id = address_id;
        this.line_1 = line_1;
        this.line_2 = line_2;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
    }

    getAll() {
        this.con.getAll(this.tableName);
    }

    get(whereConditions, orderBy = 'address_id', ascending = true) {
        this.con.get(this.tableName, whereConditions, orderBy, ascending);
    }

    insert() {
        this.con.insert(this.tableName, this.toArray());
    }

    toArray() {
        return [this.address_id, this.line_1, this.line_2, this.city, this.state, this.zipcode];
    }

}


// let obj = new Address(2, '7525 Frankford Rd', '#1100', 'Dallas', 'Texas', 75252);
// obj.getAll();
// obj.insert();