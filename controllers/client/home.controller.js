const Product= require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helper/products");

// GET /
module.exports.index = async (req, res) => {
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6);
    
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

    const productsNew= await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc"}).limit(8);

    const newProducts2 = productsHelper.priceNewProducts(productsNew);

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProducts2
    });
} 