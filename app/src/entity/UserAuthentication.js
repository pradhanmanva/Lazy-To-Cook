let mysql = require("mysql");
let conn = require("./Connection.js");

class UserAuthentication {
    constructor(user_id, password) {
        this.con = new conn();
        this.tableName = 'user_authentication';
        this.user_id = user_id;
        this.password = password;
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
        return [this.user_id, this.password];
    }

}

// let obj = new UserAuthentication(1, 'gj100596');
// obj.getAll();
// obj.insert();