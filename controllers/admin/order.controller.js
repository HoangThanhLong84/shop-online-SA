const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const paginationHelper = require("../../helper/pagination");

const searchHelper = require("../../helper/search");
const productsHelper = require("../../helper/products");
const sendMailHelper = require("../../helper/sendMail");

const systemConfig = require("../../config/system");


module.exports.index = async (req, res) => {
    
    const countOrders = await Order.countDocuments();
    let objectPagination = paginationHelper(
        {
        currentPage:1,
        limitItems: 4
        },
        req.query,
        countOrders
    );

    const orders = await Order.find().limit(objectPagination.limitItems).skip(objectPagination.skip);
     
   
    res.render("admin/pages/orders/index", {
        pageTitle: "Danh sách đơn hàng",
        orders: orders,
        pagination: objectPagination,
    });
}



module.exports.changeStatus = async (req,res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    await Order.updateOne({_id: id}, {status:status});

    req.flash("success", "Cập nhật trạng thái đơn hàng thành công!");
    res.redirect("back");
}

module.exports.changeVerify = async (req,res) => {
    const verify = req.params.verify;
    const id = req.params.id;
    const orders = await Order.findOne({_id: id});
    const email = orders.userInfo.email;


    await Order.updateOne({_id: id}, {verify:verify});

    const subject = `Xác nhận đơn hàng thành công`;
    const html = `Đơn hàng của bạn đã được xác nhận thành công.`;

    sendMailHelper.sendMail(email, subject, html);

    req.flash("success", "Xác nhận đơn hàng thành công!");
    res.redirect("back");
}


module.exports.detail = async (req, res) => {
    
    try {
        const find = {
            _id: req.params.id
        };
    
        const order = await Order.findOne(find);

        for (const product of order.products) {
            const productInfo = await Product.findOne({
                _id:product.product_id
            }).select("title thumbnail");
    
            product.productInfo = productInfo;
            product.priceNew = productsHelper.priceNewProduct(product);
        }
        
        res.render("admin/pages/orders/detail", {
            pageTitle: "Thông tin chi tiết đơn hàng",
            order: order
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/orders`)
    }
}