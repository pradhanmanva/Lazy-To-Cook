const RestaurantRouter = require("./RestaurantRouter");

const OutletModel = require('../models/OutletModel');
const AddressModel = require('../models/AddressModel');
const RestaurantModel = require('../models/RestaurantModel');
const OrderModel = require("../models/OrderModel");
const RestaurantOrderHandler = require('../handlers/RestaurantOrderHandler');

const AppUtil = require("../utils/AppUtil");

class RestaurantOrderRouter extends RestaurantRouter {
    constructor(app) {
        super(app);
        this.init("order", "restaurant");
    }

    /**
     * GET /api/restaurants/:restaurant_id/orders
     */
    getAll(request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || (AppUtil.isAdmin(request) && !AppUtil.isOwner(request, restaurantId))) {
            return AppUtil.denyAccess(response);
        }
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        new RestaurantOrderHandler().fetchAll(restaurantModel).then(function (orders) {
            if (orders) {
                orders = orders.map(function (order, index, arr) {
                    order = order.toJSON();
                    // order = self.addHateoas(outlet);
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
     * GET /api/restaurants/:restaurant_id/orders/:id
     */
    get(id, request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || (AppUtil.isAdmin(request) && !AppUtil.isOwner(request, restaurantId))) {
            return AppUtil.denyAccess(response);
        }
        const orderId = request.params["id"];
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        const orderModel = new OrderModel(orderId.toString(), null, null, null, null);
        new RestaurantOrderHandler().fetch(orderModel, restaurantModel).then(function (order) {
            if (order) {
                order.order = order.order.toJSON();
                // outlet = self.addHateoas(outlet);
            } else {
                order = {}
            }
            response.status(200).json(order).end();
        }).catch(function (error) {
            console.error(error);
            response.status(500).send("Error occurred while fetching outlet for the specified restaurant. Please check logs for details.").end();
        });
    }

    /**
     * PUT /api/restaurants/:restaurant_id/orders/:id
     *
     * @requires request.body {
     *   "status" : ""
     * }
     */
    update(id, request, response) {
        const self = this;
        const restaurantId = request.params["restaurant_id"];
        if (!request.isAuthenticated() || (AppUtil.isAdmin(request) && !AppUtil.isOwner(request, restaurantId))) {
            return AppUtil.denyAccess(response);
        }
        const orderId = request.params["id"];
        const restaurantModel = new RestaurantModel(restaurantId.toString(), null, null, null, null);
        const orderModel = new OrderModel(orderId.toString(), null, null, null, request.body.status, null);
        new RestaurantOrderHandler().update(orderModel, restaurantModel).then(function (updatedOrderOrError) {
            if (updatedOrderOrError instanceof Error) {
                return Promise.reject(updatedOrderOrError)
            }
            let updatedOrder = updatedOrderOrError.toJSON();
            response.status(200).json(updatedOrder).end();
        }).catch(function (error) {
            response.status(500).send(error.message).end();
        });
    }

    addHateoas(outlet) {
        return {
            ...outlet,
            links: [
                {
                    rel: "self",
                    href: `/api/restaurants/${outlet.restaurant.id}/outlets/${outlet.id}`
                },
                {
                    rel: "items",
                    href: `/api/restaurants/${outlet.restaurant.id}/outlets/${outlet.id}/items`
                }
            ]
        }
    }
}

module.exports = RestaurantOrderRouter;