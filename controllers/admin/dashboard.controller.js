const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const paginationHelper = require("../../helper/pagination");

// GET /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0, 
            inactive: 0,
        }, 
        product: {
            total: 0,
            active: 0, 
            inactive: 0,
        },
        order: {
            total: 0,
            not_delivery: 0, 
            delivered: 0,
        },
        user: {
            total: 0,
            active: 0, 
            inactive: 0,
        },
    };
    // Product-Category
    statistic.categoryProduct.total = await ProductCategory.countDocuments({
        
        deleted: false
    });

    statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
        status: "inactive",
        deleted: false
    });

    statistic.categoryProduct.active = await ProductCategory.countDocuments({
        status: "active",
        deleted: false
    });
    
    // Product
    statistic.product.total = await Product.countDocuments({
        deleted: false
    });

    statistic.product.inactive = await Product.countDocuments({
        status: "inactive",
        deleted: false
    });

    statistic.product.active = await Product.countDocuments({
        status: "active",
        deleted: false
    });

    // User

    // Product
    statistic.user.total = await User.countDocuments({
        deleted: false
    });

    statistic.user.inactive = await User.countDocuments({
        status: "inactive",
        deleted: false
    });

    statistic.user.active = await User.countDocuments({
        status: "active",
        deleted: false
    });

    // Order

    statistic.order.total = await Order.countDocuments({
    });

    statistic.order.not_delivery = await Order.countDocuments({
        status: "not_delivery"
    });

    statistic.order.delivered = await Order.countDocuments({
        status: "delivered"
    });


    const countOrders = await Order.countDocuments();
    let objectPagination = paginationHelper(
        {
        currentPage:1,
        limitItems: 6
        },
        req.query,
        countOrders
    );

    const orders = await Order.find().limit(objectPagination.limitItems).skip(objectPagination.skip);
    
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic,
        orders: orders,
        pagination: objectPagination
    });
} 