const Model = require("../framework/Model");

class RestaurantModel extends Model {
    constructor(/* string */ id, 
                /* string */ name, 
                /* string */ contact, 
                /* string */ email, 
                /* string */ website) {
        super(id);
        this.name = name;
        this.contact = contact;
        this.email = email;
        this.website = website;
    }
}

module.exports = RestaurantModel;