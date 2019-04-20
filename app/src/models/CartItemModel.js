const Model = require("../framework/Model");

class CartItemModel extends Model {
    constructor(/* string */ id,
                /* ItemModel */ item,
                /* string */ quantity) {
        super(id);
        this.cart_id = id;
        this.item = item;
        this.quantity = quantity;
    }
}

module.exports = CartItemModel;