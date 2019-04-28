const Model = require("../framework/Model");

class CartItemModel extends Model {
    constructor(/* string */ id,
                /* ItemModel */ item,
                /* CartModel */ cart,
                /* OutletModel */ outlet,
                /* string */ quantity) {
        super(id);
        this.item = item;
        this.quantity = quantity;
        this.cart = cart;
        this.outlet = outlet;
    }

    isValid() {
        return (this.quantity > 0);
    }
}

module.exports = CartItemModel;