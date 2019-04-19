const OutletRouter = require("./OutletRouter");

const MenuItemHandler = require("../handlers/MenuItemHandler");

const ItemModel = require("../models/ItemModel");
const OutletModel = require("../models/OutletModel");
const RestaurantModel = require("../models/RestaurantModel");
const RestaurantItemCategoryModel = require("../models/RestaurantItemCategoryModel");
const AppUtil = require("../utils/AppUtil");

class MenuItemRouter extends OutletRouter {
    constructor(app) {
        super(app);
        this.init("item", "outlet");
    }

    /**
    * GET /api/restaurants/:restaurant_id/outlets/:outlet_id/items
    */
    getAll(request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || (AppUtil.isAdmin(request) && !AppUtil.isOwner(request, restaurantId))) {
            return AppUtil.denyAccess(response);
        }
        const outletId = request.params["outlet_id"];
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        const outletModel = new OutletModel(outletId.toString(), null, null, null, restaurantModel);
        new MenuItemHandler().fetchAll(outletModel).then(function(items) {
            items = items.map(function(item, index, arr) {
                item = item.toJSON();
                item = self.addHateoas(restaurantId, outletId, item);
                return item;
            });
            response.status(200).json(items).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while fetching items for the specified outlet. Please check logs for details.").end();
        });
    }

    /**
    * GET /api/restaurants/:restaurant_id/outlets/:outlet_id/items/:id
    */
    get(id, request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || (AppUtil.isAdmin(request) && !AppUtil.isOwner(request, restaurantId))) {
            return AppUtil.denyAccess(response);
        }
        const outletId = request.params["outlet_id"];
        const itemModel = new ItemModel(id.toString(), null, null, null, null);
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        const outletModel = new OutletModel(outletId.toString(), null, null, null, restaurantModel);
        new MenuItemHandler().fetch(itemModel, outletModel).then(function(item) {
            if (item) {
                item = item.toJSON();
                item = self.addHateoas(restaurantId, outletId, item);
            }
            else {
                item = {};
            }
            response.status(200).json(item).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while fetching the specified item. Please check logs for details.").end();
        });
    }

    /**
    * POST /api/restaurants/:restaurant_id/outlets/:outlet_id/items
    * 
    * 
    * @requires request.body {
    *   name : "",
    *   description : "",
    *   price : numeric,
    *   category : {
    *       id : ""
    *   }
    * }
    * 
    * Does not create a new category. Throws exception if the specified category does not exist.
    */
    add(request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || !AppUtil.isAdmin(request) || !AppUtil.isOwner(request, restaurantId)) {
            return AppUtil.denyAccess(response);
        }
        const outletId = request.params["outlet_id"];
        const outletModel = new OutletModel(outletId.toString(), null, null, null, new RestaurantModel(restaurantId.toString(), null, null, null, null));
        const menuItem = new ItemModel(null, request.body.name, request.body.description, request.body.price, new RestaurantItemCategoryModel(request.body.category.id, null, null));
        new MenuItemHandler().insert(menuItem, outletModel).then(function(insertedItem) {
            if (insertedItem) {
                insertedItem = insertedItem.toJSON();
                insertedItem = self.addHateoas(restaurantId, outletId, insertedItem);
            } else {
                insertedItem = {};
            }
            response.status(200).json(insertedItem).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while creating an item. Please check logs for details.").end();
        });
    }

    /**
    * PUT /api/restaurants/:restaurant_id/outlets/:outlet_id/items/:id
    * 
    * @requires request.body {
    *   name : "",
    *   description : "",
    *   price : numeric,
    *   category : {
    *       id : ""
    *   }
    * }
    */
    update(id, request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || !AppUtil.isAdmin(request) || !AppUtil.isOwner(request, restaurantId)) {
            return AppUtil.denyAccess(response);
        }
        const outletId = request.params["outlet_id"];
        const itemModel = new ItemModel(id, request.body.name, request.body.description, request.body.price, new RestaurantItemCategoryModel(request.body.category.id, null, null));
        const outletModel = new OutletModel(outletId.toString(), null, null, null, new RestaurantModel(restaurantId.toString(), null, null, null, null));
        new MenuItemHandler().update(itemModel, outletModel).then(function(updatedItem) {
            if (updatedItem) {
                updatedItem = updatedItem.toJSON();
                updatedItem = self.addHateoas(restaurantId, outletId, updatedItem);
            } else {
                updatedItem = {};
            }
            response.status(200).json(updatedItem).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while updating the item. Please check logs for details.").end();
        });
    }

    /**
    * DELETE /api/restaurants/:restaurant_id/outlets/:outlet_id/items/:id
    */
    delete(id, request, response) {
        const restaurantId = request.params["restaurant_id"];
        const outletId = request.params["outlet_id"];
        if (!request.isAuthenticated() || !AppUtil.isAdmin(request) || !AppUtil.isOwner(request, restaurantId)) {
            return AppUtil.denyAccess(response);
        }
        const menuItem = new ItemModel(id, null,null, null, null);
        const outletModel = new OutletModel(outletId.toString(), null, null, null, new RestaurantModel(restaurantId.toString(), null, null, null, null));
        new MenuItemHandler().delete(menuItem, outletModel).then(function(result) {
            response.status(200).send("Success").end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while deleting a item. Please check logs for details.").end();
        });
    }

    addHateoas(restaurantId, outletId, item) {
        return {
            ...item,
            links : [
                {
                    rel : "self",
                    href : `/api/restaurants/${restaurantId}/outlets/${outletId}/items/${item.id}`
                 }
            ]
        }
    }
}

module.exports = MenuItemRouter;