const UserRouter = require("./UserRouter");

const CartHandler = require('../handlers/CartHandler');

const UserModel = require('../models/UserModel');

class CartRouter extends UserRouter {
    constructor(app) {
        super(app);
        this.init("cart", "user");
    }

    /**
     * GET /api/users/:user_id/carts
     */
    getAll(request, response) {
        const self = this;
        const userId = request.params["user_id"];
        if (!request.isAuthenticated() || AppUtil.isAdmin(request) || (AppUtil.isUser(request) && !AppUtil.isOwner(request, userId))) {
            return AppUtil.denyAccess(response);
        }
        const userModel = new UserModel(userId.toString(), null, null, null, null, null, null, null);
        new CartHandler().fetchAll(userModel).then(function (carts) {
            carts = carts.map(function (cart, index, arr) {
                cart = cart.toJSON();
                cart = self.addHateoas(userId, cart);
                return cart;
            });
            response.status(200).json(carts).end();
        }).catch(function (error) {
            console.error(error);
            response.status(500).send("Error occurred while fetching items for the specified outlet. Please check logs for details.").end();
        });
    }

    addHateoas(userId, cart) {
        return {
            ...cart,
            links: [
                {
                    rel: "self",
                    href: `/api/users/${userId}/carts/${cart.id}`
                },
                {
                    rel: "items",
                    href: `/api/users/${userId}/carts/${cart.id}/items`
                }
            ]
        }
    }
}

module.exports = CartRouter;