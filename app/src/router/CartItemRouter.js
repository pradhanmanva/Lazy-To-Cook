const AppUtil = require("../utils/AppUtil");

const CartRouter = require("./CartRouter");


const CartModel = require("../models/CartModel");
const CartItemModel = require("../models/CartItemModel");
const UserModel = require('../models/UserModel');
const ItemModel = require('../models/ItemModel');

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
        if (!request.isAuthenticated() || AppUtil.isAdmin(request) || (AppUtil.isUser(request) && !AppUtil.isOwner(request, userId))) {
            return AppUtil.denyAccess(response);
        }
        const cartModel = new CartModel(cartId.toString(), null, new UserModel(userId, null, null, null, null, null, null));
        new CartItemHandler().fetchAll(cartModel).then(function (items) {
            if (items) {
                items = items.map(function (item, index, arr) {
                    item = item.toJSON();
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
     * POST /api/users/:user_id/carts/:cart_id/items
     * 
     * @requires request.body {
     *   item_id : "",
     *   quantity : ""
     * }* 
     */
    add(request, response) {
        const userId = request.params["user_id"];
        if (!request.isAuthenticated() || !AppUtil.isUser(request) || !AppUtil.isOwner(request, userId)) {
            return AppUtil.denyAccess(response);
        }
        const cartId = request.params["cart_id"];
        const cartModel = new CartModel(cartId.toString(), null, new UserModel(userId.toString()));
        const cartItemModel = new CartItemModel(cartId.toString(), new ItemModel(request.body.item_id.toString(), null, null, null, null), request.body.quantity);
        if (!cartItemModel.isValid()) {
            return AppUtil.badRequest(response);
        }
        new CartItemHandler().insert(cartModel, cartItemModel).then(function (insertedItemOrError) {
            if (insertedItemOrError instanceof Error) {
                return Promise.reject(insertedItemOrError);
            } else {
                response.status(200).send("Success").end();
            }
        }).catch(function (error) {
            if (error instanceof Error) {
                console.error(error);
                response.status(500).send(error.message).end();
            }
            else {
                if (error.error.code === "ER_DUP_ENTRY") {
                    response.status(500).send("Item already in cart").end();
                } else {
                    response.status(500).send("Some error occurred.").end();
                }
            }
        });
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
        const userId = request.params["user_id"];
        const cartId = request.params["cart_id"];
        const itemId = request.params["id"];
        if (!request.isAuthenticated() || !AppUtil.isUser(request) || !AppUtil.isOwner(request, userId)) {
            return AppUtil.denyAccess(response);
        }

        const cartItemModel = new CartItemModel(cartId.toString(), new ItemModel(itemId.toString(), null, null, null, null), 1);
        const cartModel = new CartModel(cartId.toString(), null, new UserModel(userId.toString(), null, null, null, null, null, null, null));
        if (!cartItemModel.isValid()) {
            return AppUtil.badRequest(response);
        }
        new CartItemHandler().delete(cartModel, cartItemModel).then(function(result) {
            response.status(200).send("Success").end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while deleting item from cart. Please check logs for details.").end();
        });

    }

    addHateoas() {}
}

module.exports = CartItemRouter;