const Model = require("../framework/Model");
const {isUSState, isZipcode} = require("../utils/Validators");

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

    isValid() {
        return (this.lineOne
            && this.lineOne.length
            && this.city
            && this.city.length
            && isUSState(this.state)
            && isZipcode(this.zipcode));
    }

    toJSON () {
        return {
            line1 : this.lineOne,
            line2 : this.lineTwo,
            city : this.city,
            state : this.state,
            zipcode : this.zipcode,
        }
    }
}

module.exports = AddressModel;