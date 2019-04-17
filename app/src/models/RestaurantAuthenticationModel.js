const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

class RestaurantAuthenticationModel {
    constructor(/* RestaurantModel */ restaurant, 
                /* string */ username,
                /* plain-text string */ password,
                /* boolean */ shouldEncrypt) {
        if (shouldEncrypt) {
            this.password = bcrypt.hashSync(password, SALT_ROUNDS);
        } else  {
            this.password = password;
        }
        this.username = username;
        this.restaurant = restaurant;
    }

    verifyPassword(plainTextPassword) {
        return bcrypt.compareSync(plainTextPassword, this.password);
    }
}

module.exports = RestaurantAuthenticationModel;