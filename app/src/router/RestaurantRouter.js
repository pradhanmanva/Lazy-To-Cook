const Router = require("../framework/Router");
const RestaurantModel = require("../models/RestaurantModel");
const RestaurantHandler = require("../handlers/RestaurantHandler");
/**
 * Router class for setting up the routes of restaurant entity.
 * 
 * NOTE: Please do not include routes for another entity in this class.
 */

class RestaurantRouter extends Router {
    constructor(app) {
        super(app);
        this.init("restaurant", "");
    }

    /**
    * GET /api/restaurants/:id
    */
    get(id, request, response) {
        console.log(request.isAuthenticated());
        const self = this;
        const restaurantModel = new RestaurantModel(id, null, null, null, null);
        new RestaurantHandler().fetch(restaurantModel).then(function(foundRestaurant) {
            if (foundRestaurant) {
                foundRestaurant = foundRestaurant.toJSON();
                foundRestaurant = self.addHateoas(foundRestaurant);
                response.status(200).json(foundRestaurant).end();
            }
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while creating a restaurant. Please check logs for details.").end();
        });
    }

    // /**
    // * POST /api/restaurants
    // * 
    // * @requires request.body {
    // *   name : "",
    // *   contact : "",
    // *   email : "",
    // *   website : "",
    // *   password : "",
    // *   username : ""
    // * }
    // */
    // add(request, response) {
    //     // TODO: store username, hash and store password in RestaurantAuthentication
    //     const self = this;
    //     const restaurantModel = new RestaurantModel(null, request.body.name, request.body.contact, request.body.email, request.body.website);
    //     new RestaurantHandler().insert(restaurantModel).then(function(insertedRestaraunt) {
    //         insertedRestaraunt = insertedRestaraunt.toJSON();
    //         insertedRestaraunt = self.addHateoas(insertedRestaraunt);
    //         response.status(200).json(insertedRestaraunt).end();
    //     }).catch(function(error) {
    //         console.error(error);
    //         response.status(500).send("Error occurred while creating a restaurant. Please check logs for details.").end();
    //     });
        
    // }

    /**
    * PUT /api/restaurants/:id
    * 
    * @requires request.body {
    *   name : "",
    *   contact : "",
    *   email : "",
    *   website : "",
    * }
    */
    update(id, request, response) {
        const self = this;
        const restaurantModel = new RestaurantModel(id, request.body.name, request.body.contact, request.body.email, request.body.website);
        new RestaurantHandler().update(restaurantModel).then(function(updatedRestaurant) {
            updatedRestaurant = updatedRestaurant.toJSON();
            updatedRestaurant = self.addHateoas(updatedRestaurant);
            response.status(200).json(updatedRestaurant).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while updating a restaurant. Please check logs for details.").end();
        });
    }

    /**
    * DELETE /api/restaurants/:id
    */
    delete(id, request, response) {
        const restaurantModel = new RestaurantModel(id, null, null, null, null);
        new RestaurantHandler().delete(restaurantModel).then(function(result) {
            response.status(200).send("Success").end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while deleting a restaurant. Please check logs for details.").end();
        });
    }

    addHateoas(restaurant) {
        return {
            ...restaurant,
            links : [
                {
                    rel : "self",
                    href : `/api/restaurants/${restaurant.id}`
                 },
                 {
                     rel : "outlets",
                     href : `/api/restaurants/${restaurant.id}/outlets`
                 }
            ]
        }
    }
}

module.exports = RestaurantRouter;