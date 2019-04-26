const express = require("express");
var bodyParser = require('body-parser');
const RestaurantRouter = require("./router/RestaurantRouter");
const OutletRouter = require("./router/OutletRouter");
const RestaurantItemCategoryRouter = require("./router/RestaurantItemCategoryRouter");
const MenuItemRouter = require("./router/MenuItemRouter");
const UserRouter = require("./router/UserRouter");
const CartRouter = require("./router/CartRouter");
const CartItemRouter = require("./router/CartItemRouter");
const RestaurantOrderRouter = require("./router/RestaurantOrderRouter");

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
new RestaurantOrderRouter(lazyToCookApp).wire();


const ItemListingHandler = require("./handlers/ItemListingHandler");
lazyToCookApp.get("/api/items", function (request, response) {
    if (!request.isAuthenticated() || !AppUtil.isUser(request)) {
        return AppUtil.denyAccess(response);
    }
    const userId = AppUtil.getLoggedInUserId(request);
    const itemListingHandler = new ItemListingHandler();
    itemListingHandler.fetchAll(userId, request.query).then(function (items) {
        items = items.map(function (item) {
            return {
                is_in_cart : item.is_in_cart,
                item: item.item.toJSON(),
                restaurant: item.restaurant.toJSON(),
                outlets: item.outlets.map(function (outlet) {
                    return outlet.toJSON();
                })
            }
        });
        return items;
    }).then(function(itemsToSend) {
        itemListingHandler.hasMoreItems(userId, request.query).then(function(nextPageData) {
            const page = (request.query && request.query.page && !isNaN(request.query.page)) ? parseInt(request.query.page) : 1;
            let paging = {
                hasPrevious : (page > 1),
                hasNext : nextPageData.hasMore,
                rows_per_page : nextPageData.rowsPerPage
            };
            paging.next = nextPageData.hasMore ? nextPageData.next : page;
            paging.previous = paging.hasPrevious ? page - 1 : page;

            const result = {
                items : itemsToSend,
                paging : paging
            }
            response.send(result).end();
        });
    });
});

const CategoryHandler = require("./handlers/CategoryHandler");
lazyToCookApp.get("/api/categories", function(request, response) {
    if (!request.isAuthenticated() || !AppUtil.isUser(request)) {
        return AppUtil.denyAccess(response);
    }
    new CategoryHandler().fetchAll().then(function(categories) {
        categories = categories.map(function(category) {
            return category.toJSON();
        })
        response.send(categories).end();
    })
});

lazyToCookApp.get("/app/*", function (request, response) {
    response.sendFile(__dirname + '/client/build/index.html');
    // response.render('auth', { title: lazyToCookApp.get('app-name')});
});

lazyToCookApp.listen(PORT, () => {
    console.log(`Listening to port: http://${HOST}:${PORT}`);
});
