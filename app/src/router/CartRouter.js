const UserRouter = require("./UserRouter");

const CartHandler = require('../handlers/CartHandler');

const UserModel = require('../models/UserModel');
const CartModel = require("../models/CartModel");

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

    /**
     * GET /api/users/:user_id/carts/:id
     */
    get(id, request, response) {
        const self = this;
        const userId = request.params["user_id"];
        const cartId = request.params["id"];
        if (!request.isAuthenticated() || AppUtil.isAdmin(request) || (AppUtil.isUser(request) && !AppUtil.isOwner(request, userId))) {
            return AppUtil.denyAccess(response);
        }
        const userModel = new UserModel(userId.toString(), null, null, null, null, null, null, null);
        const cartModel = new CartModel(cartId.toString(), null, userModel);
        const cartHandler = new CartHandler();
        cartHandler.fetch(cartModel).then(function (cartOrError) {
            if (cartOrError) {
                if (cartOrError instanceof Error) {
                    return Promise.reject(cartOrError);
                } else {
                    cartOrError.cart = cartOrError.cart.toJSON();
                    cartOrError.cart = self.addHateoas(userId, cartOrError.cart);
                    response.status(200).json(cartOrError).end();  
                }
            }
        }).catch(function (error) {
            console.error(error);
            response.status(500).send(error.message).end();
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