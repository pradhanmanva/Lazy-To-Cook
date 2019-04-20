const AppUtil = require("../utils/AppUtil");

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
        const self = this;
        const userId = request.params["user_id"];
        const cartId = request.params["cart_id"];
        if (!request.isAuthenticated() || (AppUtil.isAdmin(request) && !AppUtil.isOwner(request, userId))) {
            return AppUtil.denyAccess(response);
        }
        const cartModel = new CartModel(cartId.toString(), null, new UserModel(userId, null, null, null, null, null, null));
        new CartItemHandler().fetchAll(cartModel).then(function (items) {
            if (items) {
                items = items.map(function (item, index, arr) {
                    item = item.toJSON();
                    item = self.addHateoas(item);
                    return item;
                });
            } else {
                items = [];
            }
            response.status(200).json(items).end();
        }).catch(function (error) {
            console.error(error);
            response.status(500).send("Error occurred while fetching items for the specified cart of user. Please check logs for details.").end();
        });
    }

    /**
     * GET /api/users/:user_id/carts/:cart_id/items/:id
     */
    get(id, request, response) {
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