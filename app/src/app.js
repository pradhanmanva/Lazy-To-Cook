const express = require("express");
const RestaurantRouter = require("./router/RestaurantRouter");
const OutletRouter = require("./router/OutletRouter");
const ItemRouter = require("./router/ItemRouter");
const UserRouter = require("./router/UserRouter");

const lazyToCookApp = express();
const HOST = "localhost";
const PORT = 8000;

new RestaurantRouter(lazyToCookApp).wire();
new OutletRouter(lazyToCookApp).wire();
new ItemRouter(lazyToCookApp).wire();
new UserRouter(lazyToCookApp).wire();

lazyToCookApp.listen(PORT, () => {
    console.log(`Listening to port: http://${HOST}:${PORT}`);
})
