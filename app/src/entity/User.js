let conn = require("./Connection.js");

class User {
    constructor(user_id, first_name, middle_name, last_name, date_of_birth, email_address) {
        this.con = new conn();
        this.tableName = 'user';
        this.user_id = user_id;
        this.first_name = first_name;
        this.middle_name = middle_name;
        this.last_name = last_name;
        this.date_of_birth = date_of_birth;
        this.email_address = email_address;
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
        return [this.user_id, this.first_name, this.middle_name, this.last_name, this.date_of_birth, this.email_address];
    }

}

// let obj = new User(3, 'Tarang', '', 'Patel', '03/08/1994', 'tarangpatel@gmail.com');
// obj.getAll();
// obj.insert();