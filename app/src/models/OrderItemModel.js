const Model = require("../framework/Model");

class OrderItemModel extends Model {
    constructor(/* ItemModel */ item,
                /* integer */ quantity) {
        super();
        this.item = item;
        this.quantity = quantity;
    }
}

module.exports = OrderItemModel;