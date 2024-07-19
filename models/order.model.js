const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        cart_id: String,
        // user_id: String,
        userInfo: {
            firstName: String,
            lastName: String,
            phone: String,
            address: String,
            email: String
        },
        products: [
            {
                product_id: String,
                price: Number,
                discountPercentage: Number,
                quantity: Number
            }
        ],
        Payments: String,
        Transfer: String
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;