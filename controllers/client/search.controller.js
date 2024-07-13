const Product = require("../../models/product.model");

const productsHelper = require("../../helper/products");

module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    let newProduct = [];
    
    
    const keywordRegex= new RegExp(keyword, "i");

    const products = await Product.find({
        title: keywordRegex,
        status: "active",
        deleted: false
    });
    const newProducts = productsHelper.priceNewProducts(products);
    
    
    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    });
    
    
};