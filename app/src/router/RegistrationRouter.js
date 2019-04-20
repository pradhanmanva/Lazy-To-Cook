const RestaurantHandler = require("../handlers/RestaurantHandler");
const RestaurantAuthenticationModel = require("../models/RestaurantAuthenticationModel");
const RestaurantModel = require("../models/RestaurantModel");

const UserHandler = require("../handlers/UserHandler");
const UserAuthenticationModel = require("../models/UserAuthenticationModel");
const UserModel = require("../models/UserModel");
const AddressModel = require("../models/AddressModel");
const AppUtil = require("../utils/AppUtil");
const {isUsername, isStrongPassword} = require("../utils/Validators");

class RegistrationRouter {
    constructor(app) {
        this.app = app;
    }

    _registerRestaurant(data, response) {
        /**
         * @requires request.body {
         *   name : "",
         *   contact : "",
         *   email : "",
         *   website : "",
         *   password : "",
         *   username : "",
         *   user_type : "admin"
         * }
         */
        const restaurantModel = new RestaurantModel(null, data.name, data.contact, data.email, data.website);
        const authCredentials = new RestaurantAuthenticationModel(restaurantModel, data.username, data.password, true);
        if (!restaurantModel.isValid() || !isUsername(data.username) || !isStrongPassword(data.password)) {
            return AppUtil.badRequest(response);
        }
        new RestaurantHandler().register(authCredentials).then(function (insertedRestaraunt) {
            if (insertedRestaraunt) {
                insertedRestaraunt = insertedRestaraunt.toJSON();
            } else {
                insertedRestaraunt = {};
            }
            response.status(200).json(insertedRestaraunt).end();
        }).catch(function (error) {
            console.error(error);
            response.status(500).send("Error occurred while creating a restaurant. Please check logs for details.").end();
        });
    }

    _registerUser(data, response) {
        /**
         * @requires request.body {
         *   first_name : "",
         *   middle_name : "",
         *   last_name : "",
         *   dob : "",
         *   email : "",
         *   password : "",
         *   user_type : "user",
         *   address : {
         *       line1 : "",
         *       line2 : "",
         *       city : "",
         *       state : "",
         *       zipcode : numeric
         *   }
         * }
         */
        const addressModel = new AddressModel(null, data.address.line1, data.address.line2, data.address.city, data.address.state, data.address.zipcode);
        const userModel = new UserModel(null, data.first_name, data.middle_name, data.last_name, data.dob, data.email, addressModel);
        const authCredentials = new UserAuthenticationModel(userModel, data.password, true);

        if (!userModel.isValid() || !isStrongPassword(data.password)) {
            return AppUtil.badRequest(response);
        }
        new UserHandler().register(authCredentials).then(function (insertedUser) {
            if (insertedUser) {
                insertedUser = insertedUser.toJSON();
            } else {
                insertedUser = {};
            }
            response.status(200).json(insertedUser).end();
        }).catch(function (error) {
            console.error(error);
            response.status(500).send("Error occurred while creating a user. Please check logs for details.").end();
        });
    }

    wire() {
        this.app.post("/auth/register", (request, response) => {
            const data = request.body;
            if (data.user_type === "admin") {
                this._registerRestaurant(data, response);
            } else if (data.user_type === "user") {
                this._registerUser(data, response);
            } else {
                response.status(500).send("Unrecognized user type.").end();
            }
        });
    }
}

module.exports = RegistrationRouter;