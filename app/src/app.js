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

lazyToCookApp.set('app-name', 'Lazy To Cook');
lazyToCookApp.use(bodyParser.json());
lazyToCookApp.use(bodyParser.urlencoded({
    extended: true
}));

const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const RegistrationRouter = require("./router/RegistrationRouter");
const AuthRouter = require('./router/AuthRouter');
const AppUtil = require("./utils/AppUtil");


lazyToCookApp.use(session({
    genid: (req) => {
      return uuid();
    },
    store: new FileStore(),
    secret: 'amtnaaanrnvadang bpparalatadenhlan',
    resave: false,
    saveUninitialized: true
}));
// lazyToCookApp.set('views', __dirname + '/client/views');
// lazyToCookApp.set('view engine', 'pug');
lazyToCookApp.use(express.static(__dirname + '/client/build'));
lazyToCookApp.use(express.static(__dirname + '/../assets'));


new AuthRouter(lazyToCookApp).wire();
new RegistrationRouter(lazyToCookApp).wire();


new RestaurantRouter(lazyToCookApp).wire();
new OutletRouter(lazyToCookApp).wire();
new MenuItemRouter(lazyToCookApp).wire();
new UserRouter(lazyToCookApp).wire();
new CartRouter(lazyToCookApp).wire();
new CartItemRouter(lazyToCookApp).wire();
new RestaurantItemCategoryRouter(lazyToCookApp).wire();


const ItemListingHandler = require("./handlers/ItemListingHandler");
lazyToCookApp.get("/api/items", function(request, response) {
    if (!request.isAuthenticated() || !AppUtil.isUser(request)) {
        return AppUtil.denyAccess(response);
    }
    new ItemListingHandler().fetchAll(request.query).then(function(items) {
        items = items.map(function(item) {
            return {
                item : item.item.toJSON(),
                restaurant : item.restaurant.toJSON(),
                outlets : item.outlets.map(function(outlet) {
                    return outlet.toJSON();
                })
            }
        })
        response.send(items).end();
    })

});

lazyToCookApp.get("/app/*", function(request, response) {
    response.sendFile(__dirname+'/client/build/index.html');
    // response.render('auth', { title: lazyToCookApp.get('app-name')});
});

lazyToCookApp.listen(PORT, () => {
    console.log(`Listening to port: http://${HOST}:${PORT}`);
})
