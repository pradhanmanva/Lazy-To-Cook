const Model = require("../framework/Model");

class AddressModel extends Model {
    constructor(/* string */ id, 
                /* string */ lineOne, 
                /* string */ lineTwo, 
                /* string */ city, 
                /* string */ state,
                /* int */ zipcode) {
        super(id);
        this.lineOne = lineOne;
        this.lineTwo = lineTwo;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
    }

    toString() {
        return `${lineOne} ${lineTwo}, ${city}, ${state} ${zipcode}`;
    }

}

module.exports = AddressModel;