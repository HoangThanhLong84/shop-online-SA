const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    "title": String,
    "category": String,
    "description": String,
    "descriptionDetail": String,
    "price": Number,
    "discountPercentage": Number,
    "stock": Number,
    "thumbnail": String,
    "status": String,
    "position": Number,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    "deleted": {
        type: Boolean,
        default: false
    },
    "view": {
        type: Number,
        default: 0
    },
    "sales": {
        type: Number,
        default: 0
    },
    deleteAt: Date
}, {
    timestamps: true
});
const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;