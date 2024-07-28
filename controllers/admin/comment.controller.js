const Comment = require("../../models/comment.model");
const systemConfig = require("../../config/system");
const paginationHelper = require("../../helper/pagination");


module.exports.index = async (req, res) => {
    
    let find = {
        deleted: false
    };

    const countComments = await Comment.countDocuments(find);
    let objectPagination = paginationHelper(
        {
        currentPage:1,
        limitItems: 4
        },
        req.query,
        countComments
    );

    const records = await Comment.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

    res.render("admin/pages/comments/index", {
        pageTitle: "Quản lí bình luận",
        pagination: objectPagination,
        records: records,
    });
};

// DELETE /admin/product-category/delete/:id
module.exports.deleteItem = async (req,res) => {
    const id = req.params.id;

    // await Product.deleteOne({ _id: id});
    await Comment.updateOne({ _id: id}, { deleted: true, deleteAt: new Date()});
    req.flash("success", "Xóa thành công bình luận!");
    res.redirect("back");
};



