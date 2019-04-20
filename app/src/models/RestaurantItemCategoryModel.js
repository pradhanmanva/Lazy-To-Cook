const Model = require("../framework/Model");

class RestaurantItemCategoryModel extends Model {
    constructor(/* string */ id, 
                /* string */ name,
                /* RestaurantModel */ restaurant) {
        super(id);
        this.name = name;
        this.restaurant = restaurant;
    }

    isValid() {
        return this.name && this.name.length;
    }
}

module.exports = RestaurantItemCategoryModel;