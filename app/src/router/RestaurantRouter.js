const Router = require("./Router");

/**
 * Router class for setting up the routes of restaurant entity.
 * 
 * NOTE: Please do not include routes for another entity in this class.
 */

class RestaurantRouter extends Router {
    constructor(app) {
        super(app);
        this.init("restaurant", "");
    }

    /**
    * GET /api/restaurants
    */
    getAll(request, response) {
        response.send(`Get restaurants`);
        response.end();

    }

    /**
    * GET /api/restaurants/:id
    */
    get(id, request, response) {
        response.send(`Get restaurant with id: ${id}.`);
        response.end();
    }

    /**
    * POST /api/restaurants
    */
    add(request, response) {

    }

    /**
    * PUT /api/restaurants/:id
    */
    update(id, request, response) {

    }

    /**
    * DELETE /api/restaurants/:id
    */
    delete(id, request, response) {

    }

    wire() {
        super.wire();
    }
    
}

module.exports = RestaurantRouter;