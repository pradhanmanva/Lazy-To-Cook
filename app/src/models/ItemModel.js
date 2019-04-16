const Model = require("../framework/Model");

class ItemModel extends Model {
    constructor(/* string */ id, 
                /* string */ name, 
                /* string */ description, 
                /* numeric */ price, 
                /* RestaurantItemCategoryModel */ category) {
        super(id);
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }

}

module.exports = ItemModel;