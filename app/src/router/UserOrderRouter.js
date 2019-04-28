const UserRouter = require("./UserRouter");

const OutletModel = require('../models/OutletModel');
const AddressModel = require('../models/AddressModel');
const ItemModel = require('../models/ItemModel');
const OrderModel = require("../models/OrderModel");
const OrderItemModel = require("../models/OrderItemModel");
const UserModel = require("../models/UserModel");
const UserOrderHandler = require('../handlers/UserOrderHandler');

const AppUtil = require("../utils/AppUtil");

class UserOrderRouter extends UserRouter {
    constructor(app) {
        super(app);
        this.init("order", "user");
    }

    /**
     * GET /api/users/:user_id/orders
     */
    getAll(request, response) {
        const self = this;
        const userId = request.params["user_id"];
        if (!request.isAuthenticated() || AppUtil.isAdmin(request) || (AppUtil.isUser(request) && !AppUtil.isOwner(request, userId))) {
            return AppUtil.denyAccess(response);
        }

        const userModel = new UserModel(userId.toString(), null, null, null, null, null, null, null);
        const orderModel = new OrderModel(null, null, userModel, null, null, null);
        new UserOrderHandler().fetchAll(orderModel).then(function (orders) {
            if (orders) {
                orders = orders.map(function (order, index, arr) {
                    order = order.toJSON();
                    return order;
                });
            } else {
                orders = []
            }
            response.status(200).json(orders).end();
        }).catch(function (error) {
            console.error(error);
            response.status(500).send("Error occurred while fetching outlets for the specified restaurant. Please check logs for details.").end();
        });
    }

    /**
     * GET /api/users/:user_id/orders/:id
     */
    get(id, request, response) {
        const self = this;
        const userId = request.params["user_id"];
        const orderId = request.params["id"];
        if (!request.isAuthenticated() || AppUtil.isAdmin(request) || (AppUtil.isUser(request) && !AppUtil.isOwner(request, userId))) {
            return AppUtil.denyAccess(response);
        }

        const userModel = new UserModel(userId.toString(), null, null, null, null, null, null, null);
        const orderModel = new OrderModel(orderId.toString(), null, userModel, null, null, null);
        new UserOrderHandler().fetch(orderModel).then(function (order) {
            if (order) {
                order.order = order.order.toJSON();
            } else {
                order = {}
            }
            response.status(200).json(order).end();
        }).catch(function (error) {
            console.error(error);
            response.status(500).send("Error occurred while fetching outlets for the specified restaurant. Please check logs for details.").end();
        });
    }

    /**
     * POST /api/users/:user_id/orders
     *
     * @requires request.body {
     *   "items" : []
     * }
     * 
     * each element in items is an object that looks like 
     * {
     *  id : "",
     *  outlet : {
     *     id : ""  
     *  },
     *  quantity : numeric
     * }
     */
    add(request, response) {
        const self = this;
        const userId = request.params["user_id"];
        if (!request.isAuthenticated() || AppUtil.isAdmin(request) || (AppUtil.isUser(request) && !AppUtil.isOwner(request, userId))) {
            return AppUtil.denyAccess(response);
        }
        if(!request.body.items || !request.body.items.length) {
            return AppUtil.badRequest(response);
        }
        let areValidItems = true;
        request.body.items.forEach((item) => {
            if (!item.id) {
                areValidItems = false;
            }
        });
        if (!areValidItems) {
            // if some item's id is missing...
            return AppUtil.badRequest(response);
        }
        if (new Set(request.body.items.map((item) => {
            return item.id;
        })).length != request.body.length) {
            // if all ids are not unique...
            return AppUtil.badRequest(response);
        }
        const items = request.body.items.map(function(item) {
            return new OrderItemModel(new ItemModel(item.id,null, null, null, null, null, [new OutletModel(item.outlet.id.toString(), null, null, null, null)]), (item.quantity ? item.quantity : 1));
        })
        const userModel = new UserModel(userId.toString(), null, null, null, null, null, null, null);
        const orderModel = new OrderModel(null, null, userModel, null, null, items);
        new UserOrderHandler().insert(orderModel).then(function(insertedOrderOrError) {
            if (insertedOrderOrError) {
                console.log(insertedOrderOrError);
                if (insertedOrderOrError instanceof Error) {
                    return Promise.reject(insertedOrderOrError);
                } else {
                    response.status(200).json(insertedOrderOrError.toJSON()).end();
                    return;
                }
            }
            response.end();
        }).catch(function (error) {
            response.status(500).send(error.message).end();
        });
    }

    addHateoas(outlet) {
        // return {
        //     ...outlet,
        //     links: [
        //         {
        //             rel: "self",
        //             href: `/api/restaurants/${outlet.restaurant.id}/outlets/${outlet.id}`
        //         },
        //         {
        //             rel: "items",
        //             href: `/api/restaurants/${outlet.restaurant.id}/outlets/${outlet.id}/items`
        //         }
        //     ]
        // }
    }
}

module.exports = UserOrderRouter;