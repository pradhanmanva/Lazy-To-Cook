const UserRouter = require("./UserRouter");

class CartRouter extends UserRouter {
    constructor(app) {
        super(app);
        this.init("cart", "user");
    }

    /**
    * GET /api/users/:user_id/carts
    */
    getAll(request, response) {
        const userId = request.params["user_id"];
        response.send(`Get all carts of user ${userId}`);
        response.end();

    }

    /**
    * GET /api/users/:user_id/carts/:id
    */
    get(id, request, response) {
        const userId = request.params["user_id"];
        response.send(`Get cart ${id} of user ${userId}`);
        response.end();
    }

    /**
    * POST /api/users/:user_id/carts
    */
    add(request, response) {

    }

    /**
    * PUT /api/users/:user_id/carts/:id
    */
    update(id, request, response) {

    }

    /**
    * DELETE /api/users/:user_id/carts/:id
    */
    delete(id, request, response) {

    }
}

module.exports = CartRouter;