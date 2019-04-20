const Model = require("../framework/Model");
const {isPhone} = require("../utils/Validators");

class OutletModel extends Model {
    constructor(/* string */ id,
                /* string */ name,
                /* AddressModel */ address,
                /* string */ contact,
                /* RestaurantModel */ restaurant) {
        super(id);
        this.name = name;
        this.address = address;
        this.contact = contact;
        this.restaurant = restaurant;
    }

    isValid() {
        return (this.name && this.name.length
            && this.address && this.address.isValid()
            && isPhone(this.contact));
    }

}

module.exports = OutletModel;