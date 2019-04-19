const RestaurantRouter = require("./RestaurantRouter");

const OutletModel = require('../models/OutletModel');
const AddressModel = require('../models/AddressModel');
const RestaurantModel = require('../models/RestaurantModel');

const OutletHandler = require('../handlers/OutletHandler');

const AppUtil = require("../utils/AppUtil");

class OutletRouter extends RestaurantRouter {
    constructor(app) {
        super(app);
        this.init("outlet", "restaurant");
    }

    /**
    * GET /api/restaurants/:restaurant_id/outlets
    */
    getAll(request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || (AppUtil.isAdmin(request) && !AppUtil.isOwner(request, restaurantId))) {
            return AppUtil.denyAccess(response);
        }
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        new OutletHandler().fetchAll(restaurantModel).then(function(outlets) {
            outlets = outlets.map(function(outlet, index, arr) {
                outlet = outlet.toJSON();
                outlet = self.addHateoas(outlet);
                return outlet;
            });
            response.status(200).json(outlets).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while fetching outlets for the specified restaurant. Please check logs for details.").end();
        });
    }

    /**
    * GET /api/restaurants/:restaurant_id/outlets/:id
    */
    get(id, request, response) {
        if (!request.isAuthenticated() || (AppUtil.isAdmin(request) && !AppUtil.isOwner(request, id))) {
            return AppUtil.denyAccess(response);
        }
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        const outletId = request.params["id"];
        const restaurantModel = new RestaurantModel(restaurantId.toString(),null, null, null, null);
        const outletModel = new OutletModel(outletId.toString(), null, null, null, restaurantModel);
        new OutletHandler().fetch(outletModel).then(function(outlet) {
            if (outlet) {
                outlet = outlet.toJSON();
                outlet = self.addHateoas(outlet);
            } else {
                outlet = {}
            }
            response.status(200).json(outlet).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while fetching outlet for the specified restaurant. Please check logs for details.").end();
        });
    }

    /**
    * POST /api/restaurants/:restaurant_id/outlets
    * 
    * @requires request.body {
    *   name : "",
    *   contact : "",
    *   address : {
    *       line1 : "",
    *       line2 : "",
    *       city : "",
    *       state : "",
    *       zipcode : ""
    *   }
    * }
    */
    add(request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || !AppUtil.isAdmin(request) || !AppUtil.isOwner(request, restaurantId)) {
            return AppUtil.denyAccess(response);
        }
        const addressModel = new AddressModel(null, request.body.address.line1, request.body.address.line2, request.body.address.city, request.body.address.state, request.body.address.zipcode);
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        const outletModel = new OutletModel(null, request.body.name, addressModel, request.body.contact, restaurantModel);
        new OutletHandler().insert(outletModel).then(function(insertedOutlet) {
            insertedOutlet = insertedOutlet.toJSON();
            insertedOutlet = self.addHateoas(insertedOutlet);
            response.status(200).json(insertedOutlet).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while creating a outlet. Please check logs for details.").end();
        });
    }

    /**
    * PUT /api/restaurants/:restaurant_id/outlets/:id
    * 
    * @requires request.body {
    *   "name" : "", 
    *   "contact" : "", 
    *   "address" : {
    *       "id" : "", 
    *       "line1" : "", 
    *       "line2" : "", 
    *       "city" : "", 
    *       "state" : "", 
    *       "zipcode" : zip
    *   }
    * }
    */
    update(id, request, response) {
        if (!request.isAuthenticated() || !AppUtil.isAdmin(request) || !AppUtil.isOwner(request, id)) {
            return AppUtil.denyAccess(response);
        }
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        const addressModel = new AddressModel(request.body.address.id, request.body.address.line1, request.body.address.line2, request.body.address.city, request.body.address.state, request.body.address.zipcode);
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        const outletModel = new OutletModel(id.toString(), request.body.name, addressModel, request.body.contact, restaurantModel);
        new OutletHandler().update(outletModel).then(function(updatedOutlet) {
            updatedOutlet = updatedOutlet.toJSON();
            updatedOutlet = self.addHateoas(updatedOutlet);
            response.status(200).json(updatedOutlet).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while updating outlet. Please check logs for details.").end();
        });
    }

    /**
    * DELETE /api/restaurants/:restaurant_id/outlets/:id
    */
    delete(id, request, response) {
        if (!request.isAuthenticated() || !AppUtil.isAdmin(request) || !AppUtil.isOwner(request, id)) {
            return AppUtil.denyAccess(response);
        }
        const restaurantId = request.params["restaurant_id"];
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        const outletModel = new OutletModel(id, null, null, null, restaurantModel);
        new OutletHandler().delete(outletModel).then(function(result) {
            response.status(200).send("Success").end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while deleting a restaurant. Please check logs for details.").end();
        });
    }

    addHateoas(outlet) {
        return {
            ...outlet,
            links : [
                {
                    rel : "self",
                    href : `/api/restaurants/${outlet.restaurant.id}/outlets/${outlet.id}`
                 },
                 {
                     rel : "items",
                     href : `/api/restaurants/${outlet.restaurant.id}/outlets/${outlet.id}/items`
                 }
            ]
        }
    }
}

module.exports = OutletRouter;