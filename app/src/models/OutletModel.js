const Model = require("../framework/Model");

class OutletModel extends Model {
    constructor(/* string */ id, 
                /* string */ name, 
                /* string */ address, 
                /* string */ contact, 
                /* RestaurantModel */ restaurant) {
        super(id);
        this.name = name;
        this.address = address;
        this.contact = contact;
        this.restaurant = restaurant;
    }

}

module.exports = OutletModel;