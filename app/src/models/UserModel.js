const Model = require("../framework/Model");
const {isEmail, isDate, isWebAddress} = require("../utils/Validators");


class UserModel extends Model {
    constructor(/* string */ id,
                /* string */ firstName,
                /* string */ middleName,
                /* string */ lastName,
                /* string */ dateOfBirth,
                /* string */ email,
                /* AddressModel */ address,
                /* boolean */is_deleted) {
        super(id);
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.address = address;
        this.is_deleted = is_deleted || false;
    }

    fullName() {
        if (this.middleName && this.middleName.length) {
            return `${this.firstName} ${this.middleName} ${this.lastName}`.trim();
        } else {
            return `${this.firstName} ${this.lastName}`.trim();
        }
    }

    isValid() {
        return (this.firstName
            && this.firstName.length > 0
            && this.lastName
            && this.lastName.length > 0
            && isEmail(this.email)
            && isDate(this.dateOfBirth)
            && this.address
            && this.address.isValid());
    }

    toJSON(shouldIncludeIsDeleted) {
        let result = {
            first_name: this.firstName,
            last_name: this.lastName,
            middle_name: this.middleName,
            dob: this.dateOfBirth,
            email: this.email,
            address: this.address && this.address.toJSON(),
            full_name: this.fullName()
        }
        if (shouldIncludeIsDeleted && this.is_deleted) {
                result.is_deleted = (this.is_deleted === 1);
        }
        return result;
    }
}

module.exports = UserModel;