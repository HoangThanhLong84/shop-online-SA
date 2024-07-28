const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");
const ProductCategory = require("../../models/product-category.model");

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
    let find = {
        deleted: false
    };
    let count = 0;
    function createTree(arr, parentId = "") {
        const tree = [];
        arr.forEach((item) => {
            if (item.parent_id === parentId) {
                count++;
                const newItem = item;
                newItem.index = count;
                const children = createTree(arr, item.id);
                if (children.length > 0) {
                    newItem.children = children;
                }
                tree.push(newItem);
            }
        });
        return tree;
    }

    const records = await ProductCategory.find(find);
    const newRecords = createTree(records);

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
        products: newProducts,
        records: newRecords
    });
    
    
};