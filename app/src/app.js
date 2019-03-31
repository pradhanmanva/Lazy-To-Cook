const express = require("express");
const RestaurantRouter = require("./router/RestaurantRouter");
const OutletRouter = require("./router/OutletRouter");
const MenuItemRouter = require("./router/MenuItemRouter");
const UserRouter = require("./router/UserRouter");
const CartRouter = require("./router/CartRouter");
const CartItemRouter = require("./router/CartItemRouter");

const lazyToCookApp = express();
const HOST = "localhost";
const PORT = 8000;

new RestaurantRouter(lazyToCookApp).wire();
new OutletRouter(lazyToCookApp).wire();
new MenuItemRouter(lazyToCookApp).wire();
new UserRouter(lazyToCookApp).wire();
new CartRouter(lazyToCookApp).wire();
new CartItemRouter(lazyToCookApp).wire();

lazyToCookApp.listen(PORT, () => {
    console.log(`Listening to port: http://${HOST}:${PORT}`);
})
