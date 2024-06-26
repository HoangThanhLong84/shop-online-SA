const Product = require("../../models/product.model");

const productsHelper = require("../../helper/products");

// GET /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    }).sort({position: "desc"});

    const newProducts = products.map(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
        return item;
    });

    res.render("client/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: newProducts,
    });
}

// GET /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug
        };
        
        const product = await Product.findOne(find);
        // const newProducts = productsHelper.priceNewProducts(product);

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });

    } catch (error) {
        res.redirect(`/products`);
    }
}