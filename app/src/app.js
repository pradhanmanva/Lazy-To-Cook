const express = require("express");
var bodyParser = require('body-parser');
const RestaurantRouter = require("./router/RestaurantRouter");
const OutletRouter = require("./router/OutletRouter");
const RestaurantItemCategoryRouter = require("./router/RestaurantItemCategoryRouter");
const MenuItemRouter = require("./router/MenuItemRouter");
const UserRouter = require("./router/UserRouter");
const CartRouter = require("./router/CartRouter");
const CartItemRouter = require("./router/CartItemRouter");

const lazyToCookApp = express();
const HOST = "localhost";
const PORT = 8000;

lazyToCookApp.use(bodyParser.json());
lazyToCookApp.use(bodyParser.urlencoded({
    extended: true
}));

const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const RestaurantHandler = require("./handlers/RestaurantHandler");
const RestaurantAuthenticationModel = require("./models/RestaurantAuthenticationModel");
const RestaurantModel = require("./models/RestaurantModel");

const UserHandler = require("./handlers/UserHandler");
const UserAuthenticationModel = require("./models/UserAuthenticationModel");
const UserModel = require("./models/UserModel");
const AddressModel = require("./models/AddressModel");

passport.use(new LocalStrategy(
    { usernameField: 'username', passwordField : 'password', passReqToCallback : true },
    (request, username, password, done) => {
        if (request.body.user_type === "admin") {
            const authCredentials = new RestaurantAuthenticationModel(null, username, password, false);
            new RestaurantHandler().validate(authCredentials).then(function(restaurantId) {
                return done(null, {"user_id" : restaurantId, type : "admin"});
            }).catch(function(error) {
                return done(null, false, { message : error});
            });
        }
        else if (request.body.user_type === "user") {
            const userModel = new UserModel(null, null, null, null, null, username, null);
            const authCredentials = new UserAuthenticationModel(userModel, password, false);
            new UserHandler().validate(authCredentials).then(function(userId) {
                return done(null, {"user_id" : userId, type : "user"});
            }).catch(function(error) {
                return done(null, false, { message : error});
            });
        }
        else {
            return done(null, false, {message : 'Unrecognized user type.'});
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, `${user.user_id}::${user.type}`);
});
  
passport.deserializeUser((id, done) => {
    return done(null, {
        "user_id" : id.split("::")[0],
        "type" : id.split("::")[1]
    });
});

lazyToCookApp.use(session({
    genid: (req) => {
      return uuid();
    },
    store: new FileStore(),
    secret: 'amtnaaanrnvadang bpparalatadenhlan',
    resave: false,
    saveUninitialized: true
  }));

lazyToCookApp.use(passport.initialize());
lazyToCookApp.use(passport.session());

lazyToCookApp.post("/auth/register", (request, response) => { 
    const data = request.body;
    if (data.user_type === "admin") {
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

        new RestaurantHandler().register(authCredentials).then(function(insertedRestaraunt) {
            if (insertedRestaraunt) {
                insertedRestaraunt = insertedRestaraunt.toJSON();
            } else {
                insertedRestaraunt = {};
            }
            response.status(200).json(insertedRestaraunt).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while creating a restaurant. Please check logs for details.").end();
        });
    }
    else if (data.user_type === "user") {
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

        new UserHandler().register(authCredentials).then(function(insertedUser) {
            if (insertedUser) {
                insertedUser = insertedUser.toJSON();
            } else {
                insertedUser = {};
            }
            response.status(200).json(insertedUser).end();
        }).catch(function(error) {
            console.error(error);
            response.status(500).send("Error occurred while creating a user. Please check logs for details.").end();
        });
    }
    else {
        response.status(500).send("Unrecognized user type.").end();
    }
});

lazyToCookApp.post("/auth/login", (request, response, next) => { 
    /**
    * @requires request.body {
    *   password : "",
    *   username : "",
    *   user_type : "admin"[ or "user"]
    * }
    */
    passport.authenticate('local', (err, user, info) => {
        if (user) {
            request.login(user, (err) => {
                return response.status(200).send('Success!').end();
            })
        } else {
            return response.status(500).send('Invalid credentials!').end();
        }
    })(request, response, next);
});

lazyToCookApp.get("/auth/logout", (request, response, next) => { 
    request.logout();
    response.status(200).send("Successfully logged out!").end();
});

new RestaurantRouter(lazyToCookApp).wire();
new OutletRouter(lazyToCookApp).wire();
new MenuItemRouter(lazyToCookApp).wire();
new UserRouter(lazyToCookApp).wire();
new CartRouter(lazyToCookApp).wire();
new CartItemRouter(lazyToCookApp).wire();
new RestaurantItemCategoryRouter(lazyToCookApp).wire();

lazyToCookApp.listen(PORT, () => {
    console.log(`Listening to port: http://${HOST}:${PORT}`);
})
