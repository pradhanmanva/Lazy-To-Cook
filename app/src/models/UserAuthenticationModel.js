const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

class RestaurantAuthenticationModel {
    constructor(/* UserModel */ user, 
                /* plain-text string */ password,
                /* boolean */ shouldEncrypt) {
        if (shouldEncrypt) {
            this.password = bcrypt.hashSync(password, SALT_ROUNDS);
        } else  {
            this.password = password;
        }
        this.user = user;    
    }

    verifyPassword(plainTextPassword) {
        return bcrypt.compareSync(plainTextPassword, this.password);
    }
}

module.exports = RestaurantAuthenticationModel;