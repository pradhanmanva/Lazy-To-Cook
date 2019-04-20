const Router = require("../framework/Router");
const UserModel = require("../models/UserModel");
const UserHandler = require("../handlers/UserHandler");

/**
 * Router class for setting up the routes of restaurant entity.
 *
 * NOTE: Please do not include routes for another entity in this class.
 */

class UserRouter extends Router {
    constructor(app) {
        super(app);
        this.init("user", "");
    }

    /**
     * GET /api/users
     */
    getAll(request, response) {
        response.send(`Get users`);
        response.end();
    }

    /**
     * GET /api/users/:id
     */
    get(id, request, response) {
        const self = this;
        const userModel = new UserModel(id, null, null, null, null, null, null);
        new UserHandler().fetch(userModel).then(function (foundUser) {
            if (foundUser) {
                foundUser = foundUser.toJSON();
                // foundUser = self.addHateoas(foundUser);
                response.status(200).json(foundUser).end();
            }
        }).catch(function (error) {
            console.error(error);
            response.status(500).send("Error occurred while getting a user. Please check logs for details.").end();
        });
    }

    /**
     * POST /api/users
     */
    add(request, response) {

    }

    /**
     * PUT /api/users/:id
     */
    update(id, request, response) {

    }

    /**
     * DELETE /api/users/:id
     */
    delete(id, request, response) {

    }
}

module.exports = UserRouter;