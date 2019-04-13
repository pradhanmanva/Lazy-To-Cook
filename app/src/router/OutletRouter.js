const RestaurantRouter = require("./RestaurantRouter");

class OutletRouter extends RestaurantRouter {
    constructor(app) {
        super(app);
        this.init("outlet", "restaurant");
    }

    /**
    * GET /api/restaurants/:restaurant_id/outlets
    */
    getAll(request, response) {
        const restaurantId = request.params["restaurant_id"];
        response.send(`Get all outlets of restaurant ${restaurantId}`);
        response.end();

    }

    /**
    * GET /api/restaurants/:restaurant_id/outlets/:id
    */
    get(id, request, response) {
        const restaurantId = request.params["restaurant_id"];
        response.send(`Get outlet ${id} of restaurant ${restaurantId}`);
        response.end();
    }

    /**
    * POST /api/restaurants/:restaurant_id/outlets
    */
    add(request, response) {

    }

    /**
    * PUT /api/restaurants/:restaurant_id/outlets/:id
    */
    update(id, request, response) {

    }

    /**
    * DELETE /api/restaurants/:restaurant_id/outlets/:id
    */
    delete(id, request, response) {

    }
}

module.exports = OutletRouter;