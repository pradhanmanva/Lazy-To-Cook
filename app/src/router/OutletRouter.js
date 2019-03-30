const RestaurantRouter = require("./RestaurantRouter");
const UrlUtil = require("../utils/UrlUtil");
const AppUtil = require("../utils/AppUtil");

class OutletRouter extends RestaurantRouter {
    constructor(app) {
        super(app);
        this.parentEntity = "restaurant";
        this.entity = "outlet";
        this.urlPattern = UrlUtil.appendPart(this.urlPattern, 
            UrlUtil.appendPart(AppUtil.getEntityIdPattern(this.parentEntity), AppUtil.pluralize(this.entity)));
    }

    /**
    * GET /api/restaurants/:restaurant_id/outlets
    */
    getAll(request, response) {
        const restaurantId = request.params[AppUtil.getEntityIdStr(this.parentEntity)];
        response.send(`Get all outlets of restaurant ${restaurantId}`);
        response.end();

    }

    /**
    * GET /api/restaurants/:restaurant_id/outlets/:id
    */
    get(id, request, response) {
        const restaurantId = request.params[AppUtil.getEntityIdStr(this.parentEntity)];
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

    wire() {
        super.wire();
    }

}

module.exports = OutletRouter;