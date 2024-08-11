const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        cart_id: String,
        user_id: String,
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
        status: {
            type: String,
            default: "not_delivery"
        },
        Payments: {
            type: String,
            default: "Payments"
        },
        Transfer: String,
        total: String,
        verify: {
            type: String,
            default: "not_verify"
        }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;