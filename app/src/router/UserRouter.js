const Router = require("../framework/Router");

/**
 * Router class for setting up the routes of restaurant entity.
 * 
 * NOTE: Please do not include routes for another entity in this class.
 */

class UserRouter extends Router {
    constructor(app) {
        super(app);
        this.init("user", "");
    }

    /**
    * GET /api/users
    */
    getAll(request, response) {
        response.send(`Get users`);
        response.end();

    }

    /**
    * GET /api/users/:id
    */
    get(id, request, response) {
        response.send(`Get user with id: ${id}.`);
        response.end();
    }

    /**
    * POST /api/users
    */
    add(request, response) {

    }

    /**
    * PUT /api/users/:id
    */
    update(id, request, response) {

    }

    /**
    * DELETE /api/users/:id
    */
    delete(id, request, response) {

    }

    wire() {
        super.wire();
    }
    
}

module.exports = UserRouter;