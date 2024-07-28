const md5= require("md5");
const User = require("../../models/user.model");
const paginationHelper = require("../../helper/pagination");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");

const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
    
    const filterStatus= filterStatusHelper(req.query);
    
    let find = {
        deleted: false
    };

    if(req.query.status) {
        find.status = req.query.status;
    }
    
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.firstName= objectSearch.regex;
    }
    
    const countUsers = await User.countDocuments(find);
    let objectPagination = paginationHelper(
        {
        currentPage:1,
        limitItems: 4
        },
        req.query,
        countUsers
    );

    const records = await User.find(find).select("-password -token").limit(objectPagination.limitItems).skip(objectPagination.skip);

    res.render("admin/pages/users/index", {
        pageTitle: "Danh sách người dùng",
        records: records,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}


// GET /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req,res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    await User.updateOne({_id: id}, {status:status});

    req.flash("success", "Cập nhật trạng thái người dùng thành công!");
    res.redirect("back");
}


// DELETE /admin/users/delete/:id
module.exports.deleteItem = async (req,res) => {
    const id = req.params.id;

    await User.updateOne({_id:id}, { deleted: true, deleteAt: new Date()});
    req.flash("success", "Xóa thành công người dùng!");
    res.redirect("back");
};


module.exports.edit = async (req, res) => {
    
    try {
        const id= req.params.id;

        let find = {
            _id:id,
            deleted: false
        };

        const data = await User.findOne(find);

        res.render("admin/pages/users/edit", {
            pageTitle: "Chỉnh sửa tài khoản người dùng",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/users`)
    }
}


module.exports.editPatch = async (req, res) => {
    const id= req.params.id;

    await User.updateOne({ _id: id }, req.body)
    req.flash("success", "Cập nhật tài khoản người dùng thành công")
    res.redirect("back")
    
}


module.exports.create = async (req, res) => {
    
    res.render("admin/pages/users/create", {
        pageTitle: "Tạo người dùng mới"
    });
}

module.exports.createPost = async (req, res) => {
   
    const record = new User(req.body);
    await record.save();
    req.flash("success", "Tạo mới tài khoản người dùng thành công")
    res.redirect(`${systemConfig.prefixAdmin}/users`)
}

module.exports.detail = async (req, res) => {
    
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
    
        const user = await User.findOne(find);
        
        res.render("admin/pages/users/detail", {
            pageTitle: "Thông tin chi tiết người dùng",
            user: user
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/users`)
    }
}
