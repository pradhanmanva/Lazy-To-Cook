const CartRouter = require("./CartRouter");

const CartModel = require("../models/CartModel");
const CartItemModel = require("../models/CartItemModel");

const CartItemHandler = require("../handlers/CartItemHandler");

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
        // response.send(`Get all items of cart ${cartId} of user ${userId}`);
        // response.end();

        const self = this;
        const cartModel = new CartModel(cartId, null, new UserModel(userId, null, null, null, null, null, null));
        new CartItemHandler().fetchAll(cartModel).then(function (items) {
            items = items.map(function (item, index, arr) {
                item = item.toJSON();
                item = self.addHateoas(cartId, userId, item);
                return item;
            });
            response.status(200).json(items).end();
        }).catch(function (error) {
            console.error(error);
            response.status(500).send('error').end();
        });
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