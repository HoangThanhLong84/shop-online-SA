const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");

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
    if(!req.cookies.cartId){
        const expiresTime = 1000 * 60 * 60 * 24 * 365;
        const cart = new Cart();
        await cart.save();
        console.log(cart);
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        });  
    }
    
    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    });
    
    
};