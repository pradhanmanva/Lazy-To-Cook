const Model = require("../framework/Model");
const {isEmail, isPhone, isWebAddress} = require("../utils/Validators");

class RestaurantModel extends Model {
    constructor(/* string */ id,
                /* string */ name,
                /* string */ contact,
                /* string */ email,
                /* string */ website,
                /* */ is_deleted) {
        super(id);
        this.name = name;
        this.contact = contact;
        this.email = email;
        this.website = website;
        this.is_deleted = is_deleted || false;
    }

    isValid() {
        return (this.name
            && this.name.length
            && this.email
            && isEmail(this.email)
            && isWebAddress(this.website)
            && isPhone(this.contact));
    }
}

module.exports = RestaurantModel;