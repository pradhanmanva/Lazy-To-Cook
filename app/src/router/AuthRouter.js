const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const RestaurantHandler = require("../handlers/RestaurantHandler");
const RestaurantAuthenticationModel = require("../models/RestaurantAuthenticationModel");

const UserHandler = require("../handlers/UserHandler");
const UserAuthenticationModel = require("../models/UserAuthenticationModel");
const UserModel = require("../models/UserModel");

class AuthRouter {
    constructor(app) {
        this.app = app;
        this._validateCredentials = this._validateCredentials.bind(this);
    }

    _login(request, response, next) {
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
                    return response.status(200).send({
                        status : true,
                        redirectTo: `/app/${user.type}/${user.user_id}`
                    }).end();
                })
            } else {
                return response.status(500).send({
                    status : false,
                    message: 'Invalid Credentials!'
                }).end();
            }
        })(request, response, next);
    }

    _logout(request, response, next) {
        request.logout();
        response.status(200).send("Successfully logged out!").end();
    }

    _userSerializer(user, done) {
        done(null, `${user.user_id}::${user.type}`);
    }

    _userDeserializer(id, done) {
        return done(null, {
            "user_id" : id.split("::")[0],
            "type" : id.split("::")[1]
        });
    }

    _validateRestaurant(username, password, done) {
        const authCredentials = new RestaurantAuthenticationModel(null, username, password, false);
        new RestaurantHandler().validate(authCredentials).then(function(restaurantId) {
            return done(null, {"user_id" : restaurantId, type : "admin"});
        }).catch(function(error) {
            return done(null, false, { message : error});
        });
    }

    _validateUser(username, password, done) {
        const userModel = new UserModel(null, null, null, null, null, username, null);
        const authCredentials = new UserAuthenticationModel(userModel, password, false);
        new UserHandler().validate(authCredentials).then(function(userId) {
            return done(null, {"user_id" : userId, type : "user"});
        }).catch(function(error) {
            return done(null, false, { message : error});
        });
    }

    _validateCredentials(request, username, password, done) {
        if (request.body.user_type === "admin") {
            this._validateRestaurant(username, password, done);
        }
        else if (request.body.user_type === "user") {
            this._validateUser(username, password, done);
        }
        else {
            return done(null, false, {message : 'Unrecognized user type.'});
        }
    }

    _checkLogin(request, response) {
        if (request.isAuthenticated()) {
            response.status(200).send({
                status : true,
                redirectTo: `/app/${request.user.type}/${request.user.user_id}`
            }).end();
        } else {
            response.status(200).send({
                status : false
            }).end();
        }
    }

    wire() {
        const self = this;
        const localStrategy = new LocalStrategy(
            { 
                usernameField: 'username', 
                passwordField : 'password', 
                passReqToCallback : true 
            },
            self._validateCredentials
        );
        passport.use(localStrategy);
        passport.serializeUser(self._userSerializer);
        passport.deserializeUser(self._userDeserializer);
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.post("/auth/login", self._login);
        this.app.get("/auth/logout", self._logout);
        this.app.get("/auth/login", self._checkLogin);
    }
}

module.exports = AuthRouter;