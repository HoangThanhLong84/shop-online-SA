const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Cart = require("../../models/cart.model");

const productsHelper = require("../../helper/products");

// GET /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    }).sort({position: "desc"});

    const newProducts = productsHelper.priceNewProducts(products);


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

    if(!req.cookies.cartId){
        const expiresTime = 1000 * 60 * 60 * 24 * 365;
        const cart = new Cart();
        await cart.save();
        console.log(cart);
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        });  
    }

    res.render("client/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: newProducts,
        records: newRecords
    });
}

// GET /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        };
        
        const product = await Product.findOne(find);
        // const newProducts = productsHelper.priceNewProducts(product);
        if(!req.cookies.cartId){
            const expiresTime = 1000 * 60 * 60 * 24 * 365;
            const cart = new Cart();
            await cart.save();
            console.log(cart);
            res.cookie("cartId", cart.id, {
                expires: new Date(Date.now() + expiresTime)
            });  
        }
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });

    } catch (error) {
        res.redirect(`/products`);
    }
}

module.exports.category = async (req, res) => {
    
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
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
    
    const products = await Product.find({
        product_category_id: category.id,
        deleted: false
    }).sort({ position: "desc"});

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
    
    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts,
        records: newRecords
    });
}

