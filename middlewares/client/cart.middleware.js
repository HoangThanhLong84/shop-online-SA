// const Cart = require("../../models/cart.model");

// module.exports.cartId = async (req, res, next) => {
    
//     const cart = await Cart.findOne({
//         _id: req.cookies.cartId
//     });
//     cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity,0);
//     res.locals.miniCart = cart;
//     next();
     
// }