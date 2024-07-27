const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");

const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const contactRoutes = require("./contact.route");

module.exports = (app) => {
    
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use("/", homeRoutes);

    app.use("/products", productRoutes);

    app.use("/search", searchRoutes);
    
    app.use("/cart", cartRoutes);
    
    app.use("/checkout", checkoutRoutes);

    app.use("/user", userRoutes);

    app.use("/contact", contactRoutes);
} 