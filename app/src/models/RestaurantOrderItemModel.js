const Model = require("../framework/Model");

class RestaurantOrderItemModel extends Model {
    constructor(/* ItemModel */ item,
                /* integer */ quantity) {
        super();
        this.item = item;
        this.quantity = quantity;
    }
}

module.exports = RestaurantOrderItemModel;