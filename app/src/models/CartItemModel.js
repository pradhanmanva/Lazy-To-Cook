const Model = require("../framework/Model");

class CartItemModel extends Model {
    constructor(/* string */ id,
                /* ItemModel */ item,
                /* string */ quantity) {
        super(id);
        this.item = item;
        this.quantity = quantity;
    }

    isValid() {
        return (this.item && this.id && (this.quantity > 0));
    }
}

module.exports = CartItemModel;