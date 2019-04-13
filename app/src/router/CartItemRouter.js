const CartRouter = require("./CartRouter");

class CartItemRouter extends CartRouter {
    constructor(app) {
        super(app);
        this.init("item", "cart");
    }

    /**
    * GET /api/users/:user_id/carts/:cart_id/items
    */
    getAll(request, response) {
        const userId = request.params["user_id"];
        const cartId = request.params["cart_id"];
        response.send(`Get all items of cart ${cartId} of user ${userId}`);
        response.end();

    }

    /**
    * GET /api/users/:user_id/carts/:cart_id/items/:id
    */
    get(id, request, response) {
        const userId = request.params["user_id"];
        const cartId = request.params["cart_id"];
        response.send(`Get item ${id} of cart ${cartId} of user ${userId}`);
        response.end();
    }

    /**
    * POST /api/users/:user_id/carts/:cart_id/items
    */
    add(request, response) {

    }

    /**
    * PUT /api/users/:user_id/carts/:cart_id/items
    */
    update(id, request, response) {

    }

    /**
    * DELETE /api/users/:user_id/carts/:cart_id/items/:id
    */
    delete(id, request, response) {

    }
}

module.exports = CartItemRouter;