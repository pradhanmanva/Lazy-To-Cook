const RestaurantRouter = require("./RestaurantRouter");

const RestaurantItemCategoryModel = require("../models/RestaurantItemCategoryModel");
const RestaurantModel = require('../models/RestaurantModel');

const RestaurantItemCategoryHandler = require('../handlers/RestaurantItemCategoryHandler');

const AppUtil = require("../utils/AppUtil");

class RestaurantItemCategoryRouter extends RestaurantRouter {
    constructor(app) {
        super(app);
        this.init("category", "restaurant");
    }

    /**
    * GET /api/restaurants/:restaurant_id/categories
    */
    getAll(request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || (AppUtil.isAdmin(request) && !AppUtil.isOwner(request, restaurantId))) {
            return AppUtil.denyAccess(response);
        }
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        new RestaurantItemCategoryHandler().fetchAll(restaurantModel).then(function(categories) {
            if (categories) {
                categories = categories.map(function(category, index, arr) {
                    category = category.toJSON();
                    category = self.addHateoas(category);
                    return category;
                });
            }
            else {
                categories = [];
            }
            response.status(200).json(categories).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while fetching outlets for the specified restaurant. Please check logs for details.").end();
        });
    }

    /**
    * GET /api/restaurants/:restaurant_id/categories/:id
    */
    get(id, request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || (AppUtil.isAdmin(request) && !AppUtil.isOwner(request, restaurantId))) {
            return AppUtil.denyAccess(response);
        }
        const categoryId = request.params["id"];
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        const categoryModel = new RestaurantItemCategoryModel(categoryId.toString(), null, restaurantModel);
        new RestaurantItemCategoryHandler().fetch(categoryModel).then(function(category) {
            if (category) {
                category = category.toJSON();
                category = self.addHateoas(category);
            }
            else {
                category = {};
            }
            response.status(200).json(category).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while fetching outlet for the specified restaurant. Please check logs for details.").end();
        });
    }

    /**
    * POST /api/restaurants/:restaurant_id/categories
    * 
    * @requires request.body {
    *   name : ""
    * }
    */
    add(request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || !AppUtil.isAdmin(request) || !AppUtil.isOwner(request, restaurantId)) {
            return AppUtil.denyAccess(response);
        }
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        const categoryModel = new RestaurantItemCategoryModel(null, request.body.name, restaurantModel);
        if (!categoryModel.isValid()) {
            return AppUtil.badRequest(response);
        }
        new RestaurantItemCategoryHandler().insert(categoryModel).then(function(insertedCategory) {
            insertedCategory = insertedCategory.toJSON();
            insertedCategory = self.addHateoas(insertedCategory);
            response.status(200).json(insertedCategory).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while creating category. Please check logs for details.").end();
        });
    }

    /**
    * PUT /api/restaurants/:restaurant_id/categories/:id
    * 
    * @requires request.body {
    *   name : ""
    * }
    */
    update(id, request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || !AppUtil.isAdmin(request) || !AppUtil.isOwner(request, restaurantId)) {
            return AppUtil.denyAccess(response);
        }
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        const categoryModel = new RestaurantItemCategoryModel(id.toString(), request.body.name, restaurantModel);
        if (!categoryModel.isValid()) {
            return AppUtil.badRequest(response);
        }
        new RestaurantItemCategoryHandler().update(categoryModel).then(function(updatedCategory) {
            updatedCategory = updatedCategory.toJSON();
            updatedCategory = self.addHateoas(updatedCategory);
            response.status(200).json(updatedCategory).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while updating outlet. Please check logs for details.").end();
        });
    }

    /**
    * DELETE /api/restaurants/:restaurant_id/categories/:id
    */
    delete(id, request, response) {
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || !AppUtil.isAdmin(request) || !AppUtil.isOwner(request, restaurantId)) {
            return AppUtil.denyAccess(response);
        }
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        const categoryModel = new RestaurantItemCategoryModel(id, null, restaurantModel);
        new RestaurantItemCategoryHandler().delete(categoryModel).then(function(result) {
            response.status(200).send("Success").end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while deleting a restaurant. Please check logs for details.").end();
        });
    }

    addHateoas(category) {
        return {
            ...category,
            links : [
                {
                    rel : "self",
                    href : `/api/restaurants/${category.restaurant.id}/categories/${category.id}`
                 }
            ]
        }
    }
}

module.exports = RestaurantItemCategoryRouter;