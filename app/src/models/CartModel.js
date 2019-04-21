const Model = require("../framework/Model");

class CartModel extends Model {
    constructor(/* string */ id,
                /* string */ cart_name,
                /* UserModel */ user) {
        super(id);
        this.name = cart_name;
        this.user = user;
    }
}

module.exports = CartModel;