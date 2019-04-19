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


new AuthRouter(lazyToCookApp).wire();
new RegistrationRouter(lazyToCookApp).wire();


new RestaurantRouter(lazyToCookApp).wire();
new OutletRouter(lazyToCookApp).wire();
new MenuItemRouter(lazyToCookApp).wire();
new UserRouter(lazyToCookApp).wire();
new CartRouter(lazyToCookApp).wire();
new CartItemRouter(lazyToCookApp).wire();
new RestaurantItemCategoryRouter(lazyToCookApp).wire();

lazyToCookApp.get("/app/*", function(request, response) {
    response.sendFile(__dirname+'/client/build/index.html');
    // response.render('auth', { title: lazyToCookApp.get('app-name')});
});

lazyToCookApp.listen(PORT, () => {
    console.log(`Listening to port: http://${HOST}:${PORT}`);
})
