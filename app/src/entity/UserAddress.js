let mysql = require("mysql");
let conn = require("./Connection.js");

class User {
    constructor(user_id, user_address) {
        this.con = new conn();
        this.tableName = 'user';
        this.user_id = user_id;
        this.user_address = user_address;
    }

    getAll() {
        this.con.getAll(this.tableName);
    }

    get(whereConditions, orderBy = 'user_id', ascending = true) {
        this.con.get(this.tableName, whereConditions, orderBy, ascending);
    }

    insert() {
        this.con.insert(this.tableName, this.toArray());
    }

    toArray() {
        return [this.user_id,  this.user_address];
    }

}

// let obj = new User(1, 'Manva', '', 'Pradhan', '03/04/1995', 'pradhanmanva@gmail.com');
// obj.getAll();
// obj.insert();